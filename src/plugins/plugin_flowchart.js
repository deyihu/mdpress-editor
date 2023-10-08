
import mdItContainer from 'markdown-it-container';
const pluginKeyword = 'flowchart';
const tokenTypeInline = 'inline';
const ttContainerOpen = 'container_' + pluginKeyword + '_open';
const ttContainerClose = 'container_' + pluginKeyword + '_close';

export function flowChartPlugin(md, config) {
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
                    value.children = [];
                }
            }

            if (token.nesting === 1) {
                return `${render(src)}`;
            } else {
                return '';
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
    return `<div class="flowchart-container">
       <div class="flowchart-code" style="display:none;">${code}</div>
       <div class="flowchart"></div>
    </div>`;
}
