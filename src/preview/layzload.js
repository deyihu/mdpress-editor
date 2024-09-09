// const IMG_TAG = '<img';
const IFRAME_TAG = '<iframe';

export function lazyLoad(html, mdEditor) {
    // if (html.indexOf(IMG_TAG) > -1) {
    //     const seg = html.split(IMG_TAG);
    //     html = seg.join(`${IMG_TAG} loading="lazy" `).toString();
    // }
    if (html.indexOf(IFRAME_TAG) > -1) {
        const seg = html.split(IFRAME_TAG);
        html = seg.join(`${IFRAME_TAG} loading="lazy" `).toString();
    }

    return html;
    // if (mdEditor.intersectionObservers) {
    //     mdEditor.intersectionObservers.forEach(intersectionObserver => {
    //         intersectionObserver.disconnect()();
    //     });
    // }
    // mdEditor.intersectionObservers = [];
    // if (typeof IntersectionObserver === 'undefined') {
    //     return;
    // }
    // const imgs = dom.querySelectorAll('img');
    // const iframes = dom.querySelectorAll('iframe');
    // const lazyDoms = [];
    // const forEach = (doms) => {
    //     Array.prototype.forEach.call(doms, (dom) => {
    //         // dom.dataset.src = dom.src;
    //         // dom.src = '';
    //         // lazyDoms.push(dom);
    //         dom.setAttribute('loading', 'lazy');
    //     });
    // };
    // forEach(imgs);
    // forEach(iframes);
    // lazyDoms.forEach(element => {
    //     const intersectionObserver = new IntersectionObserver((entries) => {
    //         // 如果 intersectionRatio 为 0，则目标在视野外，
    //         // 我们不需要做任何事情。
    //         if (entries[0].intersectionRatio <= 0) return;
    //         const element = entries[0].target;
    //         const src = element.dataset.src;
    //         if (src) {
    //             element.src = src;
    //         }

    //     });
    //     // 开始监听
    //     intersectionObserver.observe(element);
    //     mdEditor.intersectionObservers.push(intersectionObserver);
    // });

}
