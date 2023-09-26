
// import mermaid from 'mermaid';

import { getMermaid } from '../deps';
import { getToastr } from '../toast';

export function initMermaid(dom) {
    const mermaid = getMermaid();
    if (!mermaid) {
        getToastr().error('not find mermaid,please registerMermaid');
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
