import { authProcedure } from '@api/core/trpc'
import { OauthAccounts, oauthAccountSchema } from '@api/database/schema'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const authOauthDisconnectRoute = authProcedure
  .input(
    z.object({
      provider: oauthAccountSchema.shape.provider,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .delete(OauthAccounts)
      .where(
        and(eq(OauthAccounts.provider, input.provider), eq(OauthAccounts.userId, ctx.auth.userId)),
      )
  })
