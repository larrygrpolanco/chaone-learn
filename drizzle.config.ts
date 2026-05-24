import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './src/lib/server/db/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: './data/chaone.db'
	}
} satisfies Config;
