import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import pluginImport from 'eslint-plugin-import';
import tailwind from 'eslint-plugin-tailwindcss'; // v4 support via @beta

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // Use Tailwind's flat recommended config (beta supports v4)
  ...tailwind.configs['flat/recommended'],

  // Your project-specific rules
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Import ordering (groups + alpha + newlines)
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: [],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Optional Tailwind rule tweaks (can keep defaults)
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'off',
    },
  },

  // Keep your ignores
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
