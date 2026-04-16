import { Module } from "../types";

export const module6: Module = {
  id: "real-world-patterns",
  title: "Real-World TypeScript Patterns",
  description: "Result types, Zod validation, type-safe APIs, the Builder pattern, and runtime type checking that mirrors your compile-time types",
  lessons: [
    {
      id: "production-patterns",
      slug: "production-patterns",
      title: "Type-Safe APIs, Zod & Result Types",
      content: `# Production TypeScript Patterns

## Result / Either Type — Explicit Error Handling

\`\`\`typescript
// Instead of throwing errors (which lose type information), return a typed result

type Ok<T>  = { ok: true;  value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E = Error> = Ok<T> | Err<E>;

function ok<T>(value: T): Ok<T>   { return { ok: true, value }; }
function err<E>(error: E): Err<E> { return { ok: false, error }; }

// Usage — no try/catch, explicit in the return type:
async function fetchUser(id: string): Promise<Result<User, 'NOT_FOUND' | 'NETWORK_ERROR'>> {
  const res = await fetch(\`/api/users/\${id}\`).catch(() => null);
  if (!res) return err('NETWORK_ERROR');
  if (res.status === 404) return err('NOT_FOUND');
  return ok(await res.json());
}

const result = await fetchUser('42');
if (result.ok) {
  console.log(result.value.name); // TypeScript knows: value is User
} else {
  // TypeScript knows: error is 'NOT_FOUND' | 'NETWORK_ERROR'
  switch (result.error) {
    case 'NOT_FOUND': showNotFound(); break;
    case 'NETWORK_ERROR': showRetry(); break;
  }
}
\`\`\`

## Zod — Runtime Validation that Generates Types

\`\`\`typescript
import { z } from 'zod';

// Define schema — generates TypeScript type automatically:
const UserSchema = z.object({
  id:        z.number().int().positive(),
  name:      z.string().min(2).max(100),
  email:     z.string().email(),
  role:      z.enum(['admin', 'editor', 'viewer']),
  createdAt: z.coerce.date(), // string → Date automatically
  settings:  z.object({
    theme:    z.enum(['light', 'dark']).default('light'),
    language: z.string().length(2).default('en'),
  }).optional(),
});

// Infer TypeScript type from schema — single source of truth:
type User = z.infer<typeof UserSchema>;
// { id: number; name: string; email: string; role: 'admin' | 'editor' | 'viewer';
//   createdAt: Date; settings?: { theme: 'light' | 'dark'; language: string } }

// Parse external data — throws if invalid:
const user = UserSchema.parse(await fetchRaw('/api/users/1'));

// Safe parse — returns Result-like object:
const result = UserSchema.safeParse(suspiciousData);
if (result.success) {
  console.log(result.data.email); // validated User
} else {
  console.error(result.error.format()); // structured error tree
}

// Transformations and refinements:
const PasswordSchema = z
  .string()
  .min(8, 'Too short')
  .regex(/[A-Z]/, 'Need uppercase')
  .regex(/[0-9]/, 'Need number')
  .transform(pw => pw.trim()); // transform on parse

// Partial schemas for updates:
const UserUpdateSchema = UserSchema.partial().omit({ id: true, createdAt: true });
type UserUpdate = z.infer<typeof UserUpdateSchema>;
\`\`\`

## Type-Safe API Routes with tRPC

\`\`\`typescript
// tRPC — end-to-end type safety between server and client

// server/router.ts:
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<{ userId?: string }>().create();
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { userId: ctx.userId } }); // ctx.userId is now string (not optional)
});

export const appRouter = t.router({
  user: t.router({
    getById: publicProcedure
      .input(z.string().uuid())
      .query(async ({ input: userId }) => {
        return db.user.findUnique({ where: { id: userId } });
      }),

    update: protectedProcedure
      .input(UserUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        return db.user.update({ where: { id: ctx.userId }, data: input });
      }),
  }),
});

export type AppRouter = typeof appRouter;

// client/api.ts — SAME TYPES, no codegen needed:
import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from '../server/router';

const trpc = createTRPCClient<AppRouter>({ ... });

// Fully typed — autocomplete works, errors if you misuse:
const user = await trpc.user.getById.query('some-uuid');
// user: { id: string; name: string; email: string } | null
\`\`\`

## The Builder Pattern with TypeScript

\`\`\`typescript
// Type-safe query builder — each method returns 'this' for chaining

class QueryBuilder<TResult = unknown> {
  private query = '';
  private conditions: string[] = [];
  private selectedFields: string[] = [];
  private orderByClause?: string;
  private limitCount?: number;

  select<T>(...fields: (keyof T & string)[]): QueryBuilder<Pick<T, typeof fields[number]>> {
    this.selectedFields = fields;
    return this as any;
  }

  from(table: string): this {
    this.query = \`SELECT \${this.selectedFields.join(', ') || '*'} FROM \${table}\`;
    return this;
  }

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClause = \`ORDER BY \${field} \${direction}\`;
    return this;
  }

  limit(n: number): this {
    this.limitCount = n;
    return this;
  }

  build(): string {
    let sql = this.query;
    if (this.conditions.length) sql += \` WHERE \${this.conditions.join(' AND ')}\`;
    if (this.orderByClause) sql += \` \${this.orderByClause}\`;
    if (this.limitCount) sql += \` LIMIT \${this.limitCount}\`;
    return sql;
  }
}

const sql = new QueryBuilder()
  .from('users')
  .where('active = true')
  .where('role = \\'admin\\'')
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();
// SELECT * FROM users WHERE active = true AND role = 'admin' ORDER BY created_at DESC LIMIT 10
\`\`\`

\`\`\`takeaways
["Result<T, E> makes error handling explicit in the type — callers can't ignore failures", "Zod: define schema once, get runtime validation + TypeScript type for free", "z.infer<typeof Schema> eliminates the need to keep schema and type in sync", "tRPC: full-stack type safety without code generation — client and server share types", "Builder pattern with 'this' return type enables fluent chaining with correct type inference", "Use safeParse() for user input and external APIs — never trust unvalidated data"]
\`\`\`
`,
    },
  ],
};
