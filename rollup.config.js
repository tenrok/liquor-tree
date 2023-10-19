import pkg from './package.json';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import serve from 'rollup-plugin-serve';

const version = pkg.version;
const banner = `
/*!
 * LiquorTree v${version}
 * Homepage: https://github.com/amsik/liquor-tree
 * (c) ${new Date().getFullYear()} amsik
 * Released under the MIT License.
 */
`;

const plugins = [
  alias({
    resolve: ['.vue', '.js']
  }),
  vue({ css: true }),
  buble({ objectAssign: 'Object.assign' })
];

const outputES = {
  file: pkg.module,
  format: 'es',
  sourcemap: true,
  banner
};

const outputUMD = {
  file: pkg.main,
  format: 'umd',
  name: 'LiquorTree',
  sourcemap: true,
  banner
};

const config = [
  {
    input: 'src/main.js',
    output: outputES,
    cache: false,
    plugins
  },
  {
    input: 'src/main.js',
    output: outputUMD,
    cache: false,
    plugins: plugins.concat(
      process.env.NODE_ENV === 'production'
        ? terser({
            output: {
              comments: function (node, comment) {
                var text = comment.value;
                var type = comment.type;
                if (type == 'comment2') {
                  return /license/i.test(text);
                }
              }
            }
          })
        : []
    )
  }
];

if (process.env.NODE_ENV === 'development') {
  config[0].plugins.push(
    serve({
      contentBase: ['dist', 'demo'],
      port: 8081,
      open: true
    })
  );
}

export default config;
