import { getXLSX, getX_spreadsheet } from '../deps';
import { fetchScheduler } from '../fetchScheduler';
import { getToastr } from '../toast';

export function initExcel(dom, editor) {
    const els = dom.querySelectorAll('.excel-container');
    if (!els.length) {
        return [];
    }
    const XLSX = getXLSX();
    if (!XLSX) {
        const message = 'not find XLSX,please registerXLSX';
        console.error(message);
        getToastr().error(message);
        return [];
    }
    const x_spreadsheet = getX_spreadsheet();
    if (!x_spreadsheet) {
        const message = 'not find x_spreadsheet,please registerX_spreadsheet';
        console.error(message);
        getToastr().error(message);
        return [];
    }
    // const spSheets = [];
    // console.log(Swiper);
    els.forEach(el => {
        if (el.dataset.inited) {
            return;
        }
        const text = el.textContent;
        el.innerHTML = '';
        const promise = fetchScheduler.createFetch(text, {
            // ...
        });
        promise.then(res => res.arrayBuffer()).then(arrayBuffer => {
            const wb = XLSX.read(arrayBuffer);
            const json = stox(wb, XLSX);

            // console.log(json);
            // eslint-disable-next-line no-unused-vars
            const s = new x_spreadsheet(el)
                .loadData(json) // load data
                .change(data => {
                    // save data to db
                });

        }).catch(err => {
            console.error(err);
        });
    });
    // return swipers;
}

/*! xlsxspread.js (C) SheetJS LLC -- https://sheetjs.com/ */
/* eslint-env browser */
/* exported stox, xtos */
/**
 * Converts data from SheetJS to x-spreadsheet
 *
 * @param  {Object} wb SheetJS workbook object
 *
 * @returns {Object[]} An x-spreadsheet data
 */
function stox(wb, XLSX) {
    const out = [];
    wb.SheetNames.forEach(function (name) {
        const o = { name: name, rows: {} };
        const ws = wb.Sheets[name];
        if (!ws || !ws['!ref']) return;
        const range = XLSX.utils.decode_range(ws['!ref']);
        // sheet_to_json will lost empty row and col at begin as default
        range.s = { r: 0, c: 0 };
        const aoa = XLSX.utils.sheet_to_json(ws, {
            raw: false,
            header: 1,
            range: range
        });

        aoa.forEach(function (r, i) {
            const cells = {};
            r.forEach(function (c, j) {
                cells[j] = { text: c };

                const cellRef = XLSX.utils.encode_cell({ r: i, c: j });

                if (ws[cellRef] != null && ws[cellRef].f != null) {
                    cells[j].text = '=' + ws[cellRef].f;
                }
            });
            o.rows[i] = { cells: cells };
        });

        o.merges = [];
        (ws['!merges'] || []).forEach(function (merge, i) {
            // Needed to support merged cells with empty content
            if (o.rows[merge.s.r] == null) {
                o.rows[merge.s.r] = { cells: {} };
            }
            if (o.rows[merge.s.r].cells[merge.s.c] == null) {
                o.rows[merge.s.r].cells[merge.s.c] = {};
            }

            o.rows[merge.s.r].cells[merge.s.c].merge = [
                merge.e.r - merge.s.r,
                merge.e.c - merge.s.c
            ];

            o.merges[i] = XLSX.utils.encode_range(merge);
        });

        out.push(o);
    });

    return out;
}

/**
 * Converts data from x-spreadsheet to SheetJS
 *
 * @param  {Object[]} sdata An x-spreadsheet data object
 *
 * @returns {Object} A SheetJS workbook object
 */
// function xtos(sdata) {
//     var out = XLSX.utils.book_new();
//     sdata.forEach(function (xws) {
//         var ws = {};
//         var rowobj = xws.rows;
//         var minCoord = { r: 0, c: 0 }, maxCoord = { r: 0, c: 0 };
//         for (var ri = 0; ri < rowobj.len; ++ri) {
//             var row = rowobj[ri];
//             if (!row) continue;

//             Object.keys(row.cells).forEach(function (k) {
//                 var idx = +k;
//                 if (isNaN(idx)) return;

//                 var lastRef = XLSX.utils.encode_cell({ r: ri, c: idx });
//                 if (ri > maxCoord.r) maxCoord.r = ri;
//                 if (idx > maxCoord.c) maxCoord.c = idx;

//                 var cellText = row.cells[k].text, type = 's';
//                 if (!cellText) {
//                     cellText = '';
//                     type = 'z';
//                 } else if (!isNaN(Number(cellText))) {
//                     cellText = Number(cellText);
//                     type = 'n';
//                 } else if (cellText.toLowerCase() === 'true' || cellText.toLowerCase() === 'false') {
//                     cellText = Boolean(cellText);
//                     type = 'b';
//                 }

//                 ws[lastRef] = { v: cellText, t: type };

//                 if (type == 's' && cellText[0] == '=') {
//                     ws[lastRef].f = cellText.slice(1);
//                 }

//                 if (row.cells[k].merge != null) {
//                     if (ws['!merges'] == null) ws['!merges'] = [];

//                     ws['!merges'].push({
//                         s: { r: ri, c: idx },
//                         e: {
//                             r: ri + row.cells[k].merge[0],
//                             c: idx + row.cells[k].merge[1]
//                         }
//                     });
//                 }
//             });
//         }
//         ws['!ref'] = minCoord ? XLSX.utils.encode_range({
//             s: minCoord,
//             e: maxCoord
//         }) : 'A1';

//         XLSX.utils.book_append_sheet(out, ws, xws.name);
//     });

//     return out;
// }
