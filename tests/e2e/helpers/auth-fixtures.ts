import { request, BrowserContext, Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { mkdirSync, writeFileSync } from 'fs';
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

  let userId: string;
  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing.users.find(u => u.email === email);
  if (found) {
    userId = found.id;
    await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
  } else {
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error || !data.user) throw new Error(`createUser failed: ${error?.message}`);
    userId = data.user.id;
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
