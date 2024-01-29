import { AuthLayout } from '@web/layouts/auth'
import { WithRevealMenuLayout } from '@web/layouts/with-reveal-menu'
import { Route } from 'react-router-dom'

export const routes = (
  <Route element={<WithRevealMenuLayout />}>
    <Route element={<AuthLayout />}>
      <Route path="/" lazy={() => import('../pages/home')} />

      <Route path="/extension/login" lazy={() => import('../pages/extension-login')} />
    </Route>

    <Route path="/sign-in/*" lazy={() => import('../pages/sign-in')} />
    <Route path="/sign-up/*" lazy={() => import('../pages/sign-up')} />
  </Route>
)