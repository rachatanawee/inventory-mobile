import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres.wvgynigxmatjezkwrzco:ihY0GyRlZbE8jjiD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
  },
});
