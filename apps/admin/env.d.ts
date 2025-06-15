declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV?: string
        // Cloudflare R2
        readonly NEXT_PUBLIC_R2_BUCKET_NAME?: string
        readonly NEXT_PUBLIC_R2_BUCKET_URL?: string
        readonly NEXT_PUBLIC_R2_ACCESS_KEY?: string
        readonly NEXT_PUBLIC_R2_SECRET_KEY?: string
        readonly NEXT_PUBLIC_R2_ENDPOINT?: string
        // Supabase
        readonly NEXT_PUBLIC_SUPABASE_URL?: string
        readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
        readonly NEXT_PUBLIC_SUPABASE_DB_URL?: string
      }
    }
  }
}
