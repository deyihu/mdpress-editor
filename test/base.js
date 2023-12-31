// eslint-disable-next-line no-var
var mdpress = window.mdpress,
    shiki = window.shiki;
function loadMonaco() {
    return new Promise((resolve) => {
        require(['vs/editor/editor.main'], function () {
            mdpress.registerMonaco(window.monaco);
            resolve();
        });
    });
}

// eslint-disable-next-line no-unused-vars
function loadShiki() {
    // shiki.setCDN('https://microget-1300406971.cos.ap-shanghai.myqcloud.com/glicon/lib/shiki');
    const languages = [
        // 'objective-c',
        'bat',
        'c',
        'cpp',
        'csharp',
        'css',
        // 'dart',
        // 'docker',
        // 'git-commit',
        'glsl',
        'go',
        'html',
        // 'http',
        // 'ini',
        'java',
        'json',
        'jsx',
        'kotlin',
        'latex',
        // 'julia',
        'less',
        'markdown',
        'mermaid',
        'nginx',
        'php',
        'plsql',
        'postcss',
        'powershell',
        'python',
        'rust',
        'sass',
        // 'scala',
        'scss',
        'shellscript',
        'sql',
        // 'svelte',
        // 'swift',
        // 'toml',
        'typescript',
        'viml',
        'vue-html',
        'vue',
        // 'wasm',
        'yaml'
        // 'xml'

    ];

    return new Promise((resolve) => {
        shiki
            .getHighlighter({
                theme: 'material-theme-palenight',
                langs: languages
            })
            .then(highlighter => {
                mdpress.registerShikiHighlighter(highlighter);
                resolve();
            });
    });

}

// eslint-disable-next-line no-unused-vars
function init() {
    return new Promise((resolve) => {
        loadMonaco().then(() => {
            // loadShiki().then(() => {
            mdpress.registerSwiper(window.Swiper);
            mdpress.registerQRCode(window.QRCode);
            mdpress.registerMermaid(window.mermaid);
            mdpress.registerXLSX(window.XLSX);
            mdpress.registerX_spreadsheet(window.x_spreadsheet);
            mdpress.registerFlowChart(window.flowchart);
            // eslint-disable-next-line no-undef
            prettier.prettierPlugins = prettierPlugins;
            // eslint-disable-next-line no-undef
            mdpress.registerPrettier(prettier);
            resolve();
        });
        // });
    });
}
