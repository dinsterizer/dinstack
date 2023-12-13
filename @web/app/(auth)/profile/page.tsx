import { OauthConnections } from './_components/oauth-connections'
import { PersonalInfosForm } from './_components/personal-infos-form'

export default function ProfilePage() {
  return (
    <main className="p-4">
      <div className="mx-auto max-w-7xl divide-y">
        <PersonalInfosForm />

        <OauthConnections />
      </div>
    </main>
  )
}
