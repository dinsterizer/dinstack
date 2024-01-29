import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { LoadingScreen } from '@web/components/loading-screen'
import { CardContent } from '@web/components/ui/card'
import { env } from '@web/lib/env'
import { useSystemStore } from '@web/stores/system'
import { ComponentPropsWithoutRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { match } from 'ts-pattern'

type Appearance = ComponentPropsWithoutRef<typeof ClerkProvider>['appearance']

const lightAppearance = {
  variables: {
    borderRadius: '0.3rem',
    colorText: 'hsl(240 10% 3.9%)',
    colorDanger: 'hsl(0 84.2% 60.2%)',
    colorPrimary: 'hsl(240 5.9% 10%)',
    colorTextOnPrimaryBackground: 'hsl(0 0% 98%)',
    colorBackground: 'hsl(0 0% 100%)',
    colorInputText: 'hsl(240 10% 3.9%)',
    colorTextSecondary: 'hsl(240 3.8% 46.1%)',
    colorInputBackground: 'hsl(0 0% 100%)',
  },
  elements: {
    cardBox: 'rounded-xl border bg-card text-card-foreground shadow border-border',
  },
} satisfies Appearance

const darkAppearance = {
  baseTheme: dark,
  variables: {
    borderRadius: '0.3rem',
    colorText: 'hsl(0 0% 98%)',
    colorDanger: 'hsl(0 62.8% 30.6%)',
    colorPrimary: 'hsl(0 0% 98%)',
    colorTextOnPrimaryBackground: 'hsl(0 0% 98%)',
    colorBackground: 'hsl(240 10% 3.9%)',
    colorInputText: 'hsl(0 0% 98%)',
    colorTextSecondary: 'hsl(240 5% 64.9%)',
    colorInputBackground: 'hsl(240 10% 3.9%)',
  },
  elements: {
    cardBox: 'rounded-xl border bg-card text-card-foreground shadow border-border',
  },
} satisfies Appearance

export function AuthProvider(props: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const theme = useSystemStore().theme

  const appearance = match(theme)
    .with('dark', () => darkAppearance)
    .with('light', () => lightAppearance)
    .with('system', () =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? darkAppearance : lightAppearance,
    )
    .exhaustive()

  return (
    <ClerkProvider
      publishableKey={env.CLERK_PUBLISHABLE_KEY}
      routerPush={navigate}
      routerReplace={navigate}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      appearance={appearance}
    >
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>

      <ClerkLoaded>{props.children}</ClerkLoaded>
    </ClerkProvider>
  )
}
