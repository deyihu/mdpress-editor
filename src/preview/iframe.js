import { createDom } from '../util';

export function checkIframe(dom) {
    const iframes = dom.querySelectorAll('iframe');
    if (!iframes.length) {
        return;
    }
    iframes.forEach(iframe => {
        if (iframe.dataset.linked) {
            return;
        }
        const parentNode = iframe.parentNode;
        const link = createLinkEle(iframe.src);
        parentNode.insertBefore(link, iframe);
        iframe.dataset.linked = true;
    });
}

function createLinkEle(url) {
    const a = createDom('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = '独立窗口打开';
    return a;
}
