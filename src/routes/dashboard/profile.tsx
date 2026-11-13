import { createFileRoute } from '@tanstack/react-router'
import { ProfileCard } from '../../components/dashboard/ProfileCard'
import { MOCK_PROFILE } from '../../mock/dashboard-data'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return <ProfileCard profile={MOCK_PROFILE} />
}
