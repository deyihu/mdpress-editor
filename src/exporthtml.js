const TEMPLATE = `
<!DOCTYPE html>
<html>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.5/viewer.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/10.2.0/swiper-bundle.min.css">
  <link rel="stylesheet" href="https://microget-1300406971.cos.ap-shanghai.myqcloud.com/mdpress-editor/index.css">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/10.2.0/swiper-bundle.min.js"></script>
  <style>
   {style}
  </style>

  <body>
      {html}
    <script>
        const ACTIVE_CLASS = 'active';

        const on = (target, event, hanlder) => {
            target.addEventListener(event, hanlder);
        };

        function checkCodeGroup(dom) {
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

        function initSwiper(dom) {
            const els = dom.querySelectorAll('.swiper');
            if (!els.length) {
                return [];
            }
            const Swiper = window.Swiper;
            if (!Swiper) {
                const message = 'not find swiper,please registerSwiper';
                console.error(message);
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
            return swipers;
        }
        

        const dom= document.querySelector('.markdown-body');
        checkCodeGroup(dom);
        initSwiper(dom);

    </script>

  </body>
</html>
`;
export function exportHTML(html, styleText) {
    return TEMPLATE.replaceAll('{html}', html).replaceAll('{style}', styleText);
}
