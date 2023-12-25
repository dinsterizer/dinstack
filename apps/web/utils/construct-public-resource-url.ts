import { env } from '@web/lib/env'

export function constructPublicResourceUrl(url: string): string {
  return new URL(url, env.NEXT_PUBLIC_PUBLIC_BUCKET_URL).toString()
}
