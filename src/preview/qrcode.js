import { getToastr } from '../toast';
import { getQRCode } from '../deps';

export function initQRCode(dom) {
    const els = dom.querySelectorAll('.qrcode-container');
    if (!els.length) {
        return [];
    }
    const QRCode = getQRCode();
    if (!QRCode) {
        const message = 'not find QRCode,please registerQRCode';
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
        const text = el.textContent;
        el.innerHTML = '';
        // console.log(text);
        const qrcode = new QRCode(el, {
            text,
            width: 128,
            height: 128,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        swipers.push(qrcode);
    });
    return swipers;
}
