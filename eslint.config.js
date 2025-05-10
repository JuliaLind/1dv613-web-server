import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginCypress from 'eslint-plugin-cypress/flat'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    name: 'app/vue-custom-rules',
    files: ['**/*.{vue,js}'],
    rules: {
      'vue/multi-word-component-names': ['error', {
        ignores: ['Button', 'Form', 'Password', 'Select', 'Drawer', 'Accordion', 'Column', 'Toolbar', 'Fluid']
      }],
      'vue/no-reserved-component-names': 'off',
    }
  },
  {
    name: 'app/vitest',
    files: ['src/**/__tests__/*'],
    ...pluginVitest.configs.recommended,
    rules: {
      ...pluginVitest.configs.recommended.rules,
      'vitest/no-commented-out-tests': 'off',
    },
  },

  {
    ...pluginCypress.configs.recommended,
    files: [
      'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/support/**/*.{js,ts,jsx,tsx}'
    ],
  },

  skipFormatting,
])
