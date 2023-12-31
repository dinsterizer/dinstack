import { authProcedure } from '@api/core/trpc'
import {
  OrganizationMembers,
  Organizations,
  Sessions,
  organizationSchema,
} from '@api/database/schema'
import { generateFallbackLogoUrl } from '@api/lib/utils'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const organizationCreateRoute = authProcedure
  .input(
    z.object({
      organization: organizationSchema.pick({
        name: true,
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // TODO: limit

    const { organization, organizationMember } = await ctx.db.transaction(async (trx) => {
      const [organization] = await trx
        .insert(Organizations)
        .values({
          name: input.organization.name,
          logoUrl: generateFallbackLogoUrl({ name: input.organization.name }),
        })
        .returning()

      if (!organization) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create organization',
        })
      }

      const [organizationMember] = await trx
        .insert(OrganizationMembers)
        .values({
          organizationId: organization.id,
          userId: ctx.auth.userId,
          role: 'admin',
        })
        .returning()

      return {
        organization,
        organizationMember,
      }
    })

    await ctx.db
      .update(Sessions)
      .set({
        organizationId: organization.id,
      })
      .where(eq(Sessions.secretKey, ctx.auth.sessionSecretKey))

    return {
      organization: {
        ...organization,
        members: [organizationMember],
      },
    }
  })
