'use client'

import { authAtom, loginRequestFromAtom, stateAtom } from '@web/atoms/auth'
import { LoginScreen } from '@web/components/login-screen'
import { api } from '@web/lib/api'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useIsRendered } from '@ui/hooks/use-is-rendered'

export default function Page() {
  const router = useRouter()
  const [, setAuth] = useAtom(authAtom)
  const [oldState, setOldState] = useAtom(stateAtom)
  const [loginRequestFrom] = useAtom(loginRequestFromAtom)
  const isRendered = useIsRendered()

  const searchParams = useSearchParams()
  const mutation = api.auth.github.validate.useMutation({
    onSuccess(data) {
      setAuth(data.auth)
      router.push(`${loginRequestFrom.pathname}?${loginRequestFrom.searchParams}`)
    },
    onSettled() {
      setOldState(RESET)
    },
  })

  useEffect(() => {
    if (!isRendered) return

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!state || !code || state !== oldState) {
      throw new Error('This page should not be accessed directly')
    }

    mutation.mutate({
      code,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRendered])

  return (
    <div className="fixed inset-0 z-50">
      <LoginScreen isLoadingGithub={mutation.isLoading} />
    </div>
  )
}
