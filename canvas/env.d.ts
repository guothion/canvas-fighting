/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly APP_ENV: string
    // 更多环境变量...
}

interface ImportMeta {
readonly env: ImportMetaEnv
}