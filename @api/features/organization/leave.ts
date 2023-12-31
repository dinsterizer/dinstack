import { authProcedure, organizationMemberMiddleware } from '@api/core/trpc'
import { OrganizationMembers, Sessions } from '@api/database/schema'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationLeaveRoute = authProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
    }),
  )
  .use(organizationMemberMiddleware)
  .mutation(async ({ ctx, input }) => {
    if (ctx.auth.organizationId === input.organizationId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please switch to another organization before leaving this one.',
      })
    }

    const allMembers = await ctx.db.query.OrganizationMembers.findMany({
      where(t, { eq }) {
        return eq(t.organizationId, input.organizationId)
      },
    })

    if (allMembers.length === 1) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You cannot leave an organization with no other members.',
      })
    }

    const adminMembers = allMembers.filter((member) => member.role === 'admin')
    if (
      adminMembers.length === 1 &&
      adminMembers.filter((member) => member.userId === ctx.auth.userId).length === 1
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You cannot leave an organization with no other admins.',
      })
    }

    await ctx.db.transaction(async (trx) => {
      await trx
        .delete(Sessions)
        .where(
          and(
            eq(Sessions.userId, ctx.auth.userId),
            eq(Sessions.organizationId, input.organizationId),
          ),
        )

      await trx
        .delete(OrganizationMembers)
        .where(
          and(
            eq(OrganizationMembers.userId, ctx.auth.userId),
            eq(OrganizationMembers.organizationId, input.organizationId),
          ),
        )
    })
  })
