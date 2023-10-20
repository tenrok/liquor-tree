import pkg from './package.json';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import serve from 'rollup-plugin-serve';

const banner = `
/*!
 * LiquorTree v${pkg.version}
 * ${pkg.description}
 *
 * Homepage: https://amsik.github.io/liquor-tree
 * Author: ${pkg.author.name} <${pkg.author.email}>
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name}
 *
 * Fork: ${pkg.homepage}
 *
 * Licensed under the MIT license.
 */
`;

const config = ({ output = [], plugins = [], minify = false, sourcemap = true } = {}) => ({
  input: 'src/main.js',
  output: output.map((format) => ({
    name: 'LiquorTree',
    file: `dist/liquor-tree.${format}.${minify ? 'min.js' : 'js'}`,
    format,
    sourcemap,
    banner,
  })),
  cache: false,
  plugins: [
    ...plugins,
    minify
      ? terser({
          output: {
            comments: function (node, comment) {
              var text = comment.value;
              var type = comment.type;
              if (type == 'comment2') {
                return /license/i.test(text);
              }
            },
          },
        })
      : false,
  ].filter(Boolean),
});

const plugins = [
  alias({
    resolve: ['.vue', '.js'],
  }),
  vue({ css: true }),
  buble({ objectAssign: 'Object.assign' }),
];

const esm = config({ output: ['esm'], plugins });

if (process.env.NODE_ENV === 'development') {
  esm.plugins.push(
    serve({
      contentBase: ['dist', 'demo'],
      port: 8081,
      open: true,
    })
  );
}

export default [
  config({ output: ['umd'], plugins }),
  config({ output: ['umd'], plugins, minify: true }), // Minify
  esm,
];
