import type { AppRouter, AppRouterInputs, AppRouterOutputs } from '@dinstack/api/router'
import { createTRPCReact } from '@trpc/react-query'

export const api = createTRPCReact<AppRouter>({
  overrides: {
    useMutation: {
      /**
       * This function is called whenever a `.useMutation` succeeds
       **/
      async onSuccess(opts) {
        /**
         * @note that order here matters:
         * The order here allows route changes in `onSuccess` without
         * having a flash of content change whilst redirecting.
         **/
        // Calls the `onSuccess` defined in the `useQuery()`-options:
        await opts.originalFn()
        // Invalidate all queries in the react-query cache:
        await opts.queryClient.invalidateQueries()
      },
    },
  },
})

export type ApiInputs = AppRouterInputs
export type ApiOutputs = AppRouterOutputs
