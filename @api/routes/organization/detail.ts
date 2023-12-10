import { authedProcedure } from '@api/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const organizationDetailRoute = authedProcedure
  .input(
    z.object({
      organizationId: z.string().uuid(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const organization = await ctx.db.query.Organizations.findFirst({
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
      where(t, { eq }) {
        return eq(t.id, input.organizationId)
      },
    })

    if (!organization) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Organization not found',
      })
    }

    if (organization.members.find((member) => member.userId === ctx.auth.user.id) === undefined) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this organization',
      })
    }

    return {
      organization,
    }
  })