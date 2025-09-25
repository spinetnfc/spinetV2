import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    APP_URL: z.string().optional().default('http://localhost:3000'),
  });

  const envVars = {
    APP_URL: process.env.NEXT_PUBLIC_URL,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `,
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();
