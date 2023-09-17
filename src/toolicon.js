import { createDom, on } from './util';

const OPTIONS = {
    icon: 'icon-zitijiacu',
    title: '加粗',
    className: '',
    position: 'left'
};

export class ToolIcon {
    constructor(options) {
        options = Object.assign({}, OPTIONS, options);
        this.options = options;
        const { icon, title, position } = options;
        const dom = createDom('i');
        const className = options.className || '';
        let clazzName = `item iconfont ${icon}`;
        if (position === 'right') {
            clazzName += ' icon-right';
        }
        if (position === 'left') {
            clazzName += ' icon-left';
        }
        if (className) {
            clazzName = `${className} ${clazzName}`;
        }
        dom.className = clazzName;
        dom.title = title;
        dom.getEditor = () => {
            return this.getEditor();
        };
        this.dom = dom;
        this.editor = null;
    }

    isEnable() {
        if (this.options.enable === false) {
            return false;
        }
        return true;
    }

    getDom() {
        return this.dom;
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
