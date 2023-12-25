import { authProcedure } from '@api/core/trpc'
import { Sessions } from '@db/schema'
import { eq } from 'drizzle-orm'

export const authLogoutRoute = authProcedure.mutation(async ({ ctx }) => {
  await ctx.db.delete(Sessions).where(eq(Sessions.secretKey, ctx.auth.session.secretKey))
})
