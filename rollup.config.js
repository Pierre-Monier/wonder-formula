import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const createConfig = (filePath) => (
  {
    plugins: [
      // Resolve bare module specifiers to relative paths
      resolve(),
      // Minify JS
      terser({
        ecma: 2021,
        module: true,
        warnings: true,
      })
    ],
    input: `build/${filePath}.js`,
    output: {file: `dist/${filePath}.min.js`, sourcemap: true, format: 'esm'},
    preserveEntrySignatures: 'strict',
  }
);

const config = [
  createConfig('ui/wonder-editor'),
  createConfig('scripts/insert-in-object-manager/index'),
  createConfig('scripts/content-script'),
];

export default config;