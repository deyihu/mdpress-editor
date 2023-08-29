import { createDom, on } from './util';

const OPTIONS = {
    icon: 'icon-zitijiacu',
    title: '加粗'
};

export class ToolIcon {
    constructor(options) {
        options = Object.assign({}, OPTIONS, options);
        this.options = options;
        const { icon, title } = options;
        const dom = createDom('i');
        dom.className = `item iconfont ${icon}`;
        dom.title = title;
        this.dom = dom;
        this.editor = null;
    }

    isEnable() {
        if (this.options.enable === false) {
            return false;
        }
        return true;
    }

    on(event, handler) {
        on(this.dom, event, handler);
        return this;
    }

    getEditor() {
        return this.editor;
    }

    addTo(editor) {
        if (this.editor) {
            return this;
        }
        this.editor = editor;
        this.editor.toolsDom.appendChild(this.dom);
        return this;

    }

    remove() {
        if (this.editor) {
            this.editor.toolsDom.removeChild(this.dom);
            this.editor = null;
        }
    }
}
