declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV?: string
        readonly APP_BASE_URL?: string
      }
    }
  }
}

declare module '*.css'
