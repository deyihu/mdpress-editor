
import {
    FetchScheduler
} from 'fetch-scheduler';
const fetchScheduler = new FetchScheduler({
    requestCount: 6 // Concurrent number of fetch requests
});

const SNIP_FLAG = '<<< @';
export function checkSnippets(text, callback) {
    if (text.indexOf(SNIP_FLAG) === -1) {
        callback(text, false);
        return;
    }
    const array = text.split(SNIP_FLAG);
    const snips = [];
    for (let i = 1, len = array.length; i < len; i++) {
        const line = array[i];
        let snipUrl = '';
        for (let j = 0, len1 = line.length; j < len1; j++) {
            const char = line[j];
            if (char === ' ' || char === '\n' || char === '\r') {
                snips.push({
                    start: 0,
                    end: j,
                    url: snipUrl,
                    line
                });
                break;
            }
            snipUrl += char;
        }
    }
    let idx = 0;
    const end = () => {
        idx++;
        if (idx === snips.length) {
            snips.forEach(snip => {
                const { text, end, url } = snip;
                if (!text) {
                    snip.line = `<p style="color:red">fetch snip file error,url:${url}</p>` + snip.line.substring(end, Infinity);
                } else {
                    snip.line = `${text}\n` + snip.line.substring(end, Infinity);
                }
            });
            let value = array[0];
            snips.forEach(snip => {
                value += snip.line;
            });
            callback(value, true);
        }
    };
    snips.forEach(snip => {
        const promise = fetchScheduler.createFetch(snip.url, {
            // ...
        });
        promise.then(res => res.text()).then(text => {
            snip.text = text;
            end();
        }).catch(err => {
            console.error(err);
            end();
        });
    });
    // callback(text);
}
