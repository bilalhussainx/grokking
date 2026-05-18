import { BrowserContext, Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { mkdirSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STATE_DIR = join(process.cwd(), 'tests/e2e/.auth');

export type Persona = 'head' | 'counselor' | 'counselor-needs-review' | 'student-with-code' | 'student-cold' | 'student-other-agency';

export interface PersonaUser {
  userId: string;
  email: string;
  password: string;
  storageStatePath: string;
}

const PERSONAS: Record<Persona, { email: string; password: string }> = {
  'head':                       { email: 'e2e-head@test.local',     password: 'E2eTestPass!1' },
  'counselor':                  { email: 'e2e-counselor@test.local', password: 'E2eTestPass!1' },
  'counselor-needs-review':     { email: 'e2e-junior@test.local',    password: 'E2eTestPass!1' },
  'student-with-code':          { email: 'e2e-student1@test.local',  password: 'E2eTestPass!1' },
  'student-cold':               { email: 'e2e-student2@test.local',  password: 'E2eTestPass!1' },
  'student-other-agency':       { email: 'e2e-student3@test.local',  password: 'E2eTestPass!1' },
};

export async function ensurePersonaUser(persona: Persona): Promise<PersonaUser> {
  mkdirSync(STATE_DIR, { recursive: true });
  const { email, password } = PERSONAS[persona];
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  // Try to create. If the user already exists, find them and reset the password.
  // (We don't use listUsers() because GoTrue paginates at 50/page and the find
  // would silently miss the persona in a project with more users.)
  let userId: string;
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (created?.user) {
    userId = created.user.id;
  } else {
    // Already-exists is the only error we expect to recover from. Anything
    // else (network, auth, permission) is a real failure.
    const message = createError?.message ?? '';
    const isAlreadyExists = /already (been )?(registered|exists)|email.*exists/i.test(message);
    if (!isAlreadyExists) {
      throw new Error(`createUser failed for ${email}: ${message}`);
    }
    // Look up by email via the admin API. getUserByEmail is not exposed in
    // supabase-js, so we page through listUsers with a wide per_page until
    // found. This is a one-time per-persona-per-process cost.
    const pageSize = 1000;
    let page = 1;
    let foundId: string | null = null;
    for (;;) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: pageSize });
      if (listErr) throw new Error(`listUsers failed for ${email}: ${listErr.message}`);
      const match = list?.users.find(u => u.email === email);
      if (match) { foundId = match.id; break; }
      if (!list?.users.length || list.users.length < pageSize) break;
      page++;
    }
    if (!foundId) throw new Error(`createUser said "already exists" for ${email} but listUsers found nothing`);
    userId = foundId;
    const { error: updateErr } = await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
    if (updateErr) throw new Error(`password reset failed for ${email}: ${updateErr.message}`);
  }

  return {
    userId,
    email,
    password,
    storageStatePath: join(STATE_DIR, `${persona}.json`),
  };
}

export async function loginAndSaveState(page: Page, persona: PersonaUser): Promise<void> {
  await page.goto('/login');
  await page.locator('input[type="email"]').fill(persona.email);
  await page.locator('input[type="password"]').fill(persona.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
  await page.context().storageState({ path: persona.storageStatePath });
}

export async function loginPersona(context: BrowserContext, persona: Persona): Promise<PersonaUser> {
  const user = await ensurePersonaUser(persona);
  const page = await context.newPage();
  await loginAndSaveState(page, user);
  await page.close();
  return user;
}
