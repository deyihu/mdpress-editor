import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import emojiPlugin from 'markdown-it-emoji';
import { containerPlugin } from '../plugins/container';
import { katexPlugin } from '../plugins/katex';
import { mermaidPlugin } from '../plugins/mermaid';

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
            if (lang && hljs.getLanguage(lang)) {
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
