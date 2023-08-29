// import MarkdownIt from 'markdown-it';
// import { RenderRule } from 'markdown-it/lib/renderer';
// import Token from 'markdown-it/lib/token';
import container from 'markdown-it-container';
// import { nanoid } from 'nanoid';
import {
    extractTitle,
    getAdaptiveThemeMarker
} from './preWrapper';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
function uuid(prefix = '') {
    // return `ID${globalId++}`;
    const uuid = new Array(36);

    let rnd = 0,
        r;
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid[i] = '-';
        } else if (i === 14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = CHARS[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return prefix + '' + uuid.join('');
}

export const containerPlugin = (md, options) => {
    md.use(...createContainer('tip', 'TIP', md))
        .use(...createContainer('info', 'INFO', md))
        .use(...createContainer('warning', 'WARNING', md))
        .use(...createContainer('danger', 'DANGER', md))
        .use(...createContainer('details', 'Details', md))
        // explicitly escape Vue syntax
        .use(container, 'v-pre', {
            render: (tokens, idx) =>
                tokens[idx].nesting === 1 ? '<div v-pre>\n' : '</div>\n'
        })
        .use(container, 'raw', {
            render: (tokens, idx) =>
                tokens[idx].nesting === 1 ? '<div class="vp-raw">\n' : '</div>\n'
        })
        .use(...createCodeGroup(options));
};

function createContainer(klass, defaultTitle, md) {
    return [
        container,
        klass,
        {
            render(tokens, idx) {
                const token = tokens[idx];
                const info = token.info.trim().slice(klass.length).trim();
                if (token.nesting === 1) {
                    const title = md.renderInline(info || defaultTitle);
                    if (klass === 'details') {
                        return `<details class="${klass} custom-block"><summary>${title}</summary>\n`;
                    }
                    return `<div class="${klass} custom-block"><p class="custom-block-title">${title}</p>\n`;
                } else {
                    return klass === 'details' ? '</details>\n' : '</div>\n';
                }
            }
        }
    ];
}

function createCodeGroup(options) {
    return [
        container,
        'code-group',
        {
            render(tokens, idx) {
                if (tokens[idx].nesting === 1) {
                    const name = uuid();
                    let tabs = '';
                    let checked = 'checked="checked"';

                    for (
                        let i = idx + 1;
                        !(
                            tokens[i].nesting === -1 &&
                            tokens[i].type === 'container_code-group_close'
                        );
                        ++i
                    ) {
                        const isHtml = tokens[i].type === 'html_block';

                        if (
                            (tokens[i].type === 'fence' && tokens[i].tag === 'code') ||
                            isHtml
                        ) {
                            const title = extractTitle(
                                isHtml ? tokens[i].content : tokens[i].info,
                                isHtml
                            );

                            if (title) {
                                const id = uuid(7);
                                tabs += `<input type="radio" name="group-${name}" id="tab-${id}" ${checked}><label for="tab-${id}">${title}</label>`;

                                if (checked && !isHtml) tokens[i].info += ' active';
                                checked = '';
                            }
                        }
                    }

                    return `<div class="vp-code-group${getAdaptiveThemeMarker(
                        options
                    )}"><div class="tabs">${tabs}</div><div class="blocks">\n`;
                }
                return '</div></div>\n';
            }
        }
    ];
}
