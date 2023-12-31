import { getToastr } from '../toast';
import { getSwiper } from '../deps';

export function initSwiper(dom, mdEditor) {
    if (mdEditor.swipers) {
        mdEditor.swipers.forEach(swiper => {
            swiper.destroy();
        });
    }
    const els = dom.querySelectorAll('.swiper');
    if (!els.length) {
        return [];
    }
    const Swiper = getSwiper();
    if (!Swiper) {
        const message = 'not find swiper,please registerSwiper';
        console.error(message);
        getToastr().error(message);
        return [];
    }
    const swipers = [];
    // console.log(Swiper);
    els.forEach(el => {
        if (el.dataset.inited) {
            return;
        }
        const swiper = new Swiper(el, {
            speed: 400,
            spaceBetween: 100,
            pagination: {
                enable: true,
                el: '.swiper-pagination'
            }
        });
        swipers.push(swiper);
    });
    mdEditor.swipers = swipers;
}
