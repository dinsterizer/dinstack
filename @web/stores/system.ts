import { createSuperJSONStorage } from '@web/lib/zustand'
import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const systemStoreSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']),
})

export const useSystemStore = create(
  persist<z.infer<typeof systemStoreSchema>>(
    () => ({
      theme: 'system',
    }),
    {
      name: '@web/stores/system',
      version: 0,
      storage: createSuperJSONStorage(() => localStorage, systemStoreSchema),
    },
  ),
)
