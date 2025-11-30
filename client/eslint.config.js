import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 1. Tắt báo lỗi biến khai báo mà không dùng
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // 2. Cho phép dùng kiểu 'any' thoải mái
      "@typescript-eslint/no-explicit-any": "off",

      // 3. Tắt cảnh báo về React Hooks (useEffect thiếu dependency)
      "react-hooks/exhaustive-deps": "off",

      // 4. Tắt cảnh báo về prop-types (nếu dùng TS thì không cần cái này)
      "react/prop-types": "off",

      // 5. Tắt cảnh báo về Fast Refresh (thỉnh thoảng báo khi export hằng số)
      "react-refresh/only-export-components": "off"
    }
  },
])
