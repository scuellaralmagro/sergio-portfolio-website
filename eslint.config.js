import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

/**
 * Flat ESLint config.
 * - typescript-eslint lints standalone .ts/.tsx (and provides the parser
 *   used for TypeScript inside .astro frontmatter).
 * - eslint-plugin-astro lints .astro components.
 * Full type-checking still runs via `astro check` (tsc) in the build script.
 */
export default [
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'resources/'],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];
