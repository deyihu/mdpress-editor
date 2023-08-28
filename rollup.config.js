// Rollup plugins
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import builtins from 'rollup-plugin-node-builtins';
import pkg from './package.json';
const path = require('path');

const product = process.env.NODE_ENV.trim() === 'prd';
const FILEMANE = pkg.name;
const sourceMap = !product;

const banner = `/*!\n * ${pkg.name} v${pkg.version}\n  */`;
const external = ['highlight.js'];
const plugins = [
    json(),
    nodeResolve(),
    commonjs(),
    builtins()
    // babel({
    //     // exclude: ['node_modules/**']
    // })
];

function getEntry() {
    return path.join(__dirname, './index.js');
}

export default [
    {
        input: getEntry(),
        external: external,
        plugins: plugins,
        output: {
            'format': 'umd',
            'name': 'mdeditor',
            'file': `dist/${FILEMANE}.js`,
            'sourcemap': sourceMap,
            'extend': true,
            'banner': banner,
            'globals': {
                'hljs': 'highlight.js'
            }
        }
    },
    {
        input: getEntry(),
        external: external,
        plugins: plugins,
        output: {
            'sourcemap': false,
            'format': 'es',
            // banner,
            'file': `dist/${FILEMANE}.mjs`,
            'extend': true,
            'banner': banner,
            'globals': {
                'hljs': 'highlight.js'
            }
        }
    },
    {
        input: getEntry(),
        external: external,
        plugins: plugins.concat([terser()]),
        output: {
            'format': 'umd',
            'name': 'mdeditor',
            'file': `dist/${FILEMANE}.min.js`,
            'sourcemap': false,
            'extend': true,
            'banner': banner,
            'globals': {
                'hljs': 'highlight.js'
            }
        }
    }

];
