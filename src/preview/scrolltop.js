import { createDom, on } from '../util';

export function scrollTop(dom) {
    const el = createDom('div');
    el.className = 'mdeditor-scrolltop';
    el.innerHTML = '<i class="iconfont icon-huidaodingbu"></i>';
    dom.appendChild(el);
    on(el, 'click', () => {
        dom.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
}
