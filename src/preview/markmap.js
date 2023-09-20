import { Transformer } from 'markmap-lib';
import { getToastr } from '../toast';
import { getMarkMap } from '../deps';
const transformer = new Transformer();

const FLAG = '[[markmap]]';

function formatMarkMapData(text) {
    const { root, features } = transformer.transform(text);
    return encodeURIComponent(JSON.stringify({
        root,
        features
    }));
}

function getMarkMapDom(code) {
    return `<div class="markmap">
              <pre class="markmap-data">${code}</pre>
              <svg class="markmap-render"></svg>
            </div>
    `;
}

export function checkMarkMap(text) {
    if (text.indexOf(FLAG) === -1) {
        return text;
    }
    const code = formatMarkMapData(text);
    const html = getMarkMapDom(code);
    return text.replaceAll(FLAG, html);
}

export function initMarkMap(dom) {
    const els = dom.querySelectorAll('.markmap');
    if (!els.length) {
        return;
    }
    const markmap = getMarkMap();
    if (!markmap) {
        const message = 'not find markmap,please registerMarkMap';
        console.error(message);
        getToastr().error(message);
        return;
    }
    const { Markmap } = markmap;
    els.forEach(el => {
        if (el.dataset.inited) {
            return;
        }
        let code = el.children[0].textContent;
        if (!code) {
            return;
        }
        code = decodeURIComponent(code);
        let data;
        try {
            data = JSON.parse(code);
        } catch (err) {

        }
        if (!data) {
            return;
        }
        const svg = el.children[1];
        Markmap.create(svg, null, data.root);
        el.removeChild(el.children[0]);
    });
}
