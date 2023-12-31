import { authProcedure, organizationAdminMiddleware } from '@api/core/trpc'
import { OrganizationMembers, Sessions, organizationMemberSchema } from '@api/database/schema'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationMemberRemoveRoute = authProcedure
  .input(
    z.object({
      organizationId: organizationMemberSchema.shape.organizationId,
      userId: organizationMemberSchema.shape.userId,
    }),
  )
  .use(organizationAdminMiddleware)
  .mutation(async ({ ctx, input }) => {
    if (input.userId === ctx.auth.userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot remove yourself from the organization',
      })
    }

    await ctx.db.transaction(async (trx) => {
      await trx
        .delete(Sessions)
        .where(
          and(eq(Sessions.userId, input.userId), eq(Sessions.organizationId, input.organizationId)),
        )

      await trx
        .delete(OrganizationMembers)
        .where(
          and(
            eq(OrganizationMembers.userId, input.userId),
            eq(OrganizationMembers.organizationId, input.organizationId),
          ),
        )
    })
  })
