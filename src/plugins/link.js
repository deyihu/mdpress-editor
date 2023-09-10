export function checkLinks(dom) {
    const links = dom.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.indexOf('http:') > -1 || href.indexOf('https://') > -1 || href.indexOf('//') > -1) {
            link.setAttribute('target', '_blank');
        }
    });
}
