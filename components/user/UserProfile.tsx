type Props = {
  user: {
    fullName: string | null
    email: string | null
  }
}

export function UserProfile({ user }: Props) {
  return (
    <div className="rounded-xl border p-4 space-y-2">
      <h2 className="text-lg font-semibold">Profile</h2>
      <p>Name: {user.fullName ?? "Not set"}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}
