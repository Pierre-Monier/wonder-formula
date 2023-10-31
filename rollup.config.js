import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import {lezer} from "@lezer/generator/rollup"

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

const createLangSFormulaConfig = () => ({
  input: "./src/lang-sformula/sformula.grammar",
  output: {
    format: "es",
    file: "./src/lang-sformula/parser.ts"
  },
  external: ["@lezer/lr", "@lezer/highlight"],
  plugins: [lezer()]
});

const config = [
  createConfig('ui/editor'),
  createConfig('scripts/insert-in-object-manager/index'),
  createConfig('scripts/content-script'),
  createLangSFormulaConfig(),
];

export default config;