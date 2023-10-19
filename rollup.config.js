import pkg from './package.json';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import serve from 'rollup-plugin-serve';

const name = 'LiquorTree';
const version = pkg.version;
const banner = `
/*!
 * ${name} v${version}
 * Homepage: https://github.com/amsik/liquor-tree
 * (c) ${new Date().getFullYear()} amsik
 * Released under the MIT License.
 */
`;

const input = 'src/main.js';

const plugins = [
  alias({
    resolve: ['.vue', '.js'],
  }),
  vue({ css: true }),
  buble({ objectAssign: 'Object.assign' }),
];

const esm = {
  input,
  output: {
    file: pkg.module,
    format: 'es',
    sourcemap: true,
    banner,
  },
  cache: false,
  plugins,
};

const umd = {
  input,
  output: {
    file: pkg.main,
    format: 'umd',
    name,
    sourcemap: true,
    banner,
  },
  cache: false,
  plugins,
};

if (process.env.NODE_ENV === 'development') {
  esm.plugins.push(
    serve({
      contentBase: ['dist', 'demo'],
      port: 8081,
      open: true,
    })
  );
}

if (process.env.NODE_ENV === 'production') {
  umd.plugins.push(
    terser({
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
  );
}

export default [esm, umd];
