// Rollup plugins
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import builtins from 'rollup-plugin-node-builtins';
import pkg from './package.json';
const path = require('path');

const isDEV = process.env.NODE_ENV.trim() === 'dev';
const FILEMANE = pkg.name;
const sourceMap = isDEV;

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

const namespace = 'mdpress';

const globals = {
    'highlight.js': 'hljs'
};

let outs = [
    {
        input: getEntry(),
        external: external,
        plugins: plugins,
        output: {
            'format': 'umd',
            'name': namespace,
            'file': `dist/${FILEMANE}.js`,
            'sourcemap': sourceMap,
            'extend': true,
            'banner': banner,
            'globals': globals
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
            'globals': globals
        }
    },
    {
        input: getEntry(),
        external: external,
        plugins: plugins.concat([terser()]),
        output: {
            'format': 'umd',
            'name': namespace,
            'file': `dist/${FILEMANE}.min.js`,
            'sourcemap': false,
            'extend': true,
            'banner': banner,
            'globals': globals
        }
    }

];
if (isDEV) {
    outs = outs.slice(0, 1);
}

export default outs;
