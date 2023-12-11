import { z } from 'zod'
import { atomWithLocalStorage } from './_helpers'

export const loginWithEmailHistoryAtom = atomWithLocalStorage(
  'login-with-email-history-atom',
  z.object({
    previousLoginEmail: z.string().email().nullable(),
    previousLoginEmailAt: z.date().nullable(),
  }),
  {
    previousLoginEmail: null,
    previousLoginEmailAt: null,
  },
)
