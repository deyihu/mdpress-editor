import { getToastr } from '../toast';
import { getFlowChart } from '../deps';

export function initFlowChart(dom, mdEditor) {
    if (mdEditor.flowcharts) {
        mdEditor.flowcharts.forEach(flowchart => {
            flowchart.clean();
        });
    }
    const els = dom.querySelectorAll('.flowchart-container');
    if (!els.length) {
        return [];
    }
    const flowchart = getFlowChart();
    if (!flowchart) {
        const message = 'not find flowchart,please registerFlowChart';
        console.error(message);
        getToastr().error(message);
        return [];
    }
    mdEditor.flowcharts = [];
    els.forEach(el => {
        if (el.dataset.inited) {
            return;
        }
        const code = el.children[0].textContent;
        const diagram = flowchart.parse(code);
        diagram.drawSVG(el.children[1]);
        mdEditor.flowcharts.push(diagram);
    });
}
