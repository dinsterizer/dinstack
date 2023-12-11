'use client'

import { Provider, createStore } from 'jotai'

export const store = createStore()

export default function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
