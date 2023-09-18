import { Transformer } from 'markmap-lib';
import { createDom, getMarkMap } from '../util';
const transformer = new Transformer();

const FLAG = '[[markmap]]';

function formatMarkMapData(text) {
    const { root, features } = transformer.transform(text);
    return JSON.stringify({
        root,
        features
    });
}

function createContainer(text) {
    const dom = createDom('div');
    dom.className = 'markemap';
    const pre = createDom('pre');
    pre.className = 'markmap-data';
    dom.appendChild(pre);
    const svg = createDom('svg');
    svg.className = 'markmap-render';
    dom.appendChild(svg);
    return dom;
}

export function checkMarkMap(text) {
    if (text.indexOf(FLAG) === -1) {
        return text;
    }

    const code = formatMarkMapData(text);
    // const textArray = text.split(FLAG);
    const dom = createContainer();
    dom.children[0].textContent = code;
    const html = dom.outerHTML;
    return text.replaceAll(FLAG, html);
}

export function initMarkMap(dom) {
    const markmap = getMarkMap();
    if (!markmap) {
        console.error('not find markmap,please registerMarkMap');
        return;
    }
    const { Markmap } = markmap;
    const els = dom.querySelectorAll('.markemap');
    els.forEach(el => {
        if (el.dataset.inited) {
            return;
        }
        const code = el.children[0].textContent;
        if (!code) {
            return;
        }
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
