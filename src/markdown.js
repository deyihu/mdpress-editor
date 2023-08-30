import MarkdownIt from 'markdown-it';
import emojiPlugin from 'markdown-it-emoji';
import { containerPlugin } from '../plugins/container';
import { katexPlugin } from '../plugins/katex';
import { mermaidPlugin } from '../plugins/mermaid';
import { getHightLight, getShikiHighlighter } from './util';

export function installPlugins(md) {
    md.use(emojiPlugin, {});
    containerPlugin(md, { hasSingleTheme: false });
    katexPlugin(md);
    mermaidPlugin(md);
}

export function createMarkdown() {
    const md = MarkdownIt({
        html: true,
        highlight: function (str, lang) {
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

            return ''; // use external default escaping
        }
    });
    installPlugins(md);
    return md;
}
