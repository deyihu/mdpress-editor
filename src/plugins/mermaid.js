
import mdItContainer from 'markdown-it-container';
import mermaid from 'mermaid';
const pluginKeyword = 'mermaid';
const tokenTypeInline = 'inline';
const ttContainerOpen = 'container_' + pluginKeyword + '_open';
const ttContainerClose = 'container_' + pluginKeyword + '_close';

export function mermaidPlugin(md, config) {
    md.use(mdItContainer, pluginKeyword, {
        anyClass: true,
        validate: (info) => {
            return info.trim() === pluginKeyword;
        },

        render: (tokens, idx) => {
            const token = tokens[idx];

            // eslint-disable-next-line no-var
            var src = '';
            if (token.type === ttContainerOpen) {
                // eslint-disable-next-line no-var
                for (var i = idx + 1; i < tokens.length; i++) {
                    const value = tokens[i];
                    if (value === undefined || value.type === ttContainerClose) {
                        break;
                    }
                    src += value.content;
                    if (value.block && value.nesting <= 0) {
                        src += '\n';
                    }
                    // Clear these out so markdown-it doesn't try to render them
                    value.tag = '';
                    value.type = tokenTypeInline;
                    // Code can be triggered multiple times, even if tokens are not updated (eg. on editor losing and regaining focus). Content must be preserved, so src can be realculated in such instances.
                    // value.content = '';
                    value.children = [];
                }
            }

            if (token.nesting === 1) {
                return `<div class="${pluginKeyword}-container">${render(preProcess(src))}`;
            } else {
                return '</div>';
            }
        }
    });

    // const highlight = md.options.highlight;
    // md.options.highlight = (code, lang) => {
    //     const reg = new RegExp('\\b(' + config.languageIds().map(escapeRegExp).join('|') + ')\\b', 'i');
    //     if (lang && reg.test(lang)) {
    //         return `<pre style="all:unset;"><div class="${pluginKeyword}">${preProcess(code)}</div></pre>`;
    //     }
    //     return highlight(code, lang);
    // };
    return md;
}

function render(code) {
    return `
   <pre class="mermaid">
     ${code}
   </pre>
   `;
}

function preProcess(source) {
    return source
        // eslint-disable-next-line no-useless-escape
        .replace(/\</g, '&lt;')
        // eslint-disable-next-line no-useless-escape
        .replace(/\>/g, '&gt;')
        .replace(/\n+$/, '')
        .trimStart();
}

// function escapeRegExp(string) {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// }

export function initMermaid(dom) {
    if (!mermaid) {
        return;
    }
    mermaid.initialize({ startOnLoad: false });
    const els = dom.querySelectorAll('.mermaid');
    const notInit = [];
    for (let i = 0, len = els.length; i < len; i++) {
        const dataset = els[i].dataset;
        if (!dataset.processed) {
            notInit.push(1);
        }
    }
    if (notInit.length) {
        mermaid.run({
            nodes: els
        });
    }
}
