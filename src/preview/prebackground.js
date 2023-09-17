export function removePreBgColor(dom) {
    const pres = dom.querySelectorAll('pre');
    pres.forEach(pre => {
        pre.style.removeProperty('background-color');
    });
}
