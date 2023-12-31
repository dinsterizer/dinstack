import type * as _A from '@remix-run/router'
import { AuthLayout } from '@web/layouts/auth'
import { OrganizationLayout } from '@web/layouts/organization'
import { ProfileLayout } from '@web/layouts/profile'
import { WithSidebarLayout } from '@web/layouts/with-sidebar'
import { ErrorPage } from '@web/pages/error'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        Component: () => <AuthLayout />,
        children: [
          {
            Component: () => <WithSidebarLayout />,
            children: [
              {
                path: '/',
                lazy: () => import('../pages/home'),
              },
              {
                path: '/profile',
                Component: () => <ProfileLayout />,
                children: [
                  {
                    index: true,
                    lazy: () => import('../pages/profile-general'),
                  },
                  {
                    path: 'accounts',
                    lazy: () => import('../pages/profile-accounts'),
                  },
                  {
                    path: 'billing',
                    lazy: () => import('../pages/profile-billing'),
                  },
                ],
              },
              {
                path: '/organizations/:organizationId',
                Component: () => <OrganizationLayout />,
                children: [
                  {
                    index: true,
                    lazy: () => import('../pages/organization-general'),
                  },
                  {
                    path: 'members',
                    lazy: () => import('../pages/organization-members'),
                  },
                ],
              },
            ],
          },
          {
            path: '/organization-invitation-accept/:secretKey',
            lazy: () => import('../pages/organization-invitation-accept'),
          },
        ],
      },

      {
        path: '/oauth/:provider/callback',
        lazy: () => import('../pages/oauth-callback'),
      },
    ],
  },
])
