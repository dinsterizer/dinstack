import { Md5 } from 'ts-md5'

export function generateFallbackAvatarUrl(user: { name: string; email: string }) {
  const avatarUrl = new URL(`https://www.gravatar.com/avatar/${Md5.hashStr(user.email)}?s=96`)
  avatarUrl.searchParams.append('d', `https://ui-avatars.com/api/${user.name}/96/f4f4f5/09090b/1`)

  return avatarUrl.toString()
}
