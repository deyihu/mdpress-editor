import { fetchScheduler } from '../fetchScheduler';

const INCLUDE_FLAG = '@include';
export function checkInclude(text, callback) {
    if (text.indexOf(INCLUDE_FLAG) === -1) {
        callback(text, false);
        return;
    }
    const array = text.split(INCLUDE_FLAG);
    const texts = [];
    for (let i = 1, len = array.length; i < len; i++) {
        const line = array[i];
        let url = '';
        for (let j = 0, len1 = line.length; j < len1; j++) {
            const char = line[j];
            if (char === ' ' || char === '\n' || char === '\r') {
                texts.push({
                    start: 0,
                    end: j,
                    url: url,
                    line
                });
                break;
            }
            url += char;
        }
    }
    let idx = 0;
    const end = () => {
        idx++;
        if (idx === texts.length) {
            texts.forEach(singleText => {
                const { text, end, url } = singleText;
                if (!text) {
                    singleText.line = `<p style="color:red">fetch snip file error,url:${url}</p>` + singleText.line.substring(end, Infinity);
                } else {
                    singleText.line = `${text}\n` + singleText.line.substring(end, Infinity);
                }
            });
            let value = array[0];
            texts.forEach(singleText => {
                value += singleText.line;
            });
            callback(value, true);
        }
    };
    texts.forEach(singleText => {
        const promise = fetchScheduler.createFetch(singleText.url, {
            // ...
        });
        promise.then(res => res.text()).then(text => {
            singleText.text = text;
            end();
        }).catch(err => {
            console.error(err);
            end();
        });
    });
    // callback(text);
}
