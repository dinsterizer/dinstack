import { authProcedure } from '@api/core/trpc'
import {
  OrganizationMembers,
  OrganizationInvitations,
  Sessions,
  organizationInvitationSchema,
} from '@api/database/schema'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationMemberAcceptInvitationRoute = authProcedure
  .input(
    z.object({
      invitationSecretKey: organizationInvitationSchema.shape.secretKey,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const invitation = await ctx.db.query.OrganizationInvitations.findFirst({
      where(t, { eq }) {
        return eq(t.secretKey, input.invitationSecretKey)
      },
    })

    if (!invitation) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      })
    }

    if (invitation.expiresAt < new Date()) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'This invitation has expired',
      })
    }

    const existingMember = await ctx.db.query.OrganizationMembers.findFirst({
      where(t, { and, eq }) {
        return and(eq(t.organizationId, invitation.organizationId), eq(t.userId, ctx.auth.userId))
      },
    })

    if (existingMember) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are already a member of this organization',
      })
    }

    await ctx.db.transaction(async (trx) => {
      await trx.insert(OrganizationMembers).values({
        organizationId: invitation.organizationId,
        userId: ctx.auth.userId,
        role: invitation.role,
      })

      await trx
        .delete(OrganizationInvitations)
        .where(eq(OrganizationInvitations.secretKey, invitation.secretKey))
    })

    await ctx.db
      .update(Sessions)
      .set({
        organizationId: invitation.organizationId,
      })
      .where(eq(Sessions.secretKey, ctx.auth.sessionSecretKey))
  })
