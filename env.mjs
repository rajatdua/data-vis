import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const commonDBVersion = z.enum(["1","2"]).optional().transform(value => parseInt(value))

export const env = createEnv({
  server: {
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    DATABASE_URL: z.string(),
    DATABASE_VERSION: commonDBVersion
  },
  client: {
    NEXT_PUBLIC_DATABASE_VERSION_CLIENT: commonDBVersion
  },
  runtimeEnv: {
    DATABASE_VERSION: process.env.DATABASE_VERSION,
    NEXT_PUBLIC_DATABASE_VERSION_CLIENT: process.env.NEXT_PUBLIC_DATABASE_VERSION_CLIENT,
    ANALYZE: process.env.ANALYZE,
    DATABASE_URL: process.env.DATABASE_URL
  },
})
