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

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/6.0.0/d3.min.js"></script>
  <script
    src="https://microget-1300406971.cos.ap-shanghai.myqcloud.com/glicon/lib/markmap-view/markmap-view.min.js"></script>
  <style>
  html,body{
    width:100%;
    height:100%;
    padding:0px;
    margin:0px;
  }
   #markmap{
    width:100%;
    height:100%;
   }
  </style>

  <body>
      <svg id="markmap"></svg>
        <script>
        const data={data};
        markmap.Markmap.create(document.getElementById('markmap'), null, data.root);

        </script>

  </body>
</html>
`;
export function exportMarkMapHTML(data) {
    return TEMPLATE.replaceAll('{data}', data);
}
