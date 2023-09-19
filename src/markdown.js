import MarkdownIt from 'markdown-it';
import emojiPlugin from 'markdown-it-emoji';
import markdownAnchor from 'markdown-it-anchor';
import markdownToc from 'markdown-it-toc-done-right';
import { containerPlugin } from './plugins/container';
import { katexPlugin, ketexRender } from './plugins/katex';
import { mermaidPlugin, mermaidRender } from './plugins/mermaid';
import { getHightLight, getShikiHighlighter } from './util';
import { swiperPlugin } from './plugins/swiper';

export function installPlugins(md) {
    md.use(emojiPlugin, {});
    md.use(markdownAnchor, { level: 1, permalink: true, permalinkBefore: true, permalinkSymbol: '#' });
    md.use(markdownToc, {});
    containerPlugin(md, { hasSingleTheme: false });
    katexPlugin(md);
    mermaidPlugin(md);
    swiperPlugin(md);
}

export function createMarkdown() {
    const md = MarkdownIt({
        html: true,
        highlight: function (str, lang) {
            lang = lang || '';
            lang = lang.toLowerCase();
            if (lang === 'ketex') {
                return ketexRender(str);
            } else if (lang === 'mermaid') {
                return mermaidRender(str);
            }
            // console.log(str);
            const shikiHighlighter = getShikiHighlighter();
            if (shikiHighlighter && shikiHighlighter.codeToHtml) {
                return shikiHighlighter.codeToHtml(str, { lang });
            }
            const hljs = getHightLight();
            if (lang && hljs && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) { }
            }

            return str; // use external default escaping
        }
    });
    installPlugins(md);
    return md;
}
