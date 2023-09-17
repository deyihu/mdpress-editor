import { ACTIVE_CLASS, on } from '../util';

export function checkCodeGroup(dom) {
    const codeGroups = dom.querySelectorAll('.vp-code-group');
    const domActive = (dom, active = true) => {
        if (!dom) {
            return;
        }
        if (active) {
            dom.classList.add(ACTIVE_CLASS);
        } else {
            dom.classList.remove(ACTIVE_CLASS);
        }
    };
    codeGroups.forEach(codeGroup => {
        const tabsDom = codeGroup.querySelector('.tabs');
        const blocksDom = codeGroup.querySelector('.blocks');
        const radios = tabsDom.querySelectorAll('input[type=radio]');
        const pres = blocksDom.querySelectorAll('pre');
        domActive(pres[0]);
        radios.forEach((radio, index) => {
            on(radio, 'click', () => {
                pres.forEach(pre => {
                    domActive(pre, false);
                });
                const pre = pres[index];
                domActive(pre);
            });
        });
    });
}
