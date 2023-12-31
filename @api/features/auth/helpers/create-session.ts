import { Sessions } from '@api/database/schema'
import type { Context } from '@api/lib/context'
import { TRPCError } from '@trpc/server'

export async function createSession({
  ctx,
  organizationMember,
}: {
  ctx: Context & { request: Request }
  organizationMember: {
    organizationId: string
    userId: string
  }
}) {
  const [session] = await ctx.db
    .insert(Sessions)
    .values({
      headers: Object.fromEntries(ctx.request.headers.entries()),
      userId: organizationMember.userId,
      organizationId: organizationMember.organizationId,
    })
    .returning()

  if (!session) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create session',
    })
  }

  return session
}
