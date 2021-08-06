import { Method } from '../helper/Method';
import { MiniVue } from '../MiniVue';
import { Watcher } from '../response/Watcher';

export class Compiler {
    private vm: MiniVue;
    private el: HTMLElement | null;
    private methods: any;

    constructor(vm: MiniVue) {
        this.vm = vm;
        this.el = vm.$el;
        this.methods = vm.$methods;

        if (this.el) {
            this.compile(this.el);
        }
    }

    private compile(el: Node): void {
        Array.from(el.childNodes).forEach((node) => {
            if (this.isTextNode(node)) {
                this.compileText(node);
            } else if (this.isElementNode(node)) {
                this.compileElement(node as HTMLElement);
            }
            // 子节点还有子节点，递归遍历
            if (node.childNodes) {
                this.compile(node);
            }
        });
    }

    private update(node: HTMLElement, key: string, attrName: string, val: any): void {
        if (attrName === 'text') {
            node.textContent = val;
            new Watcher(this.vm, key, new Method((val: string) => (node.textContent = val)));
        } else if (attrName === 'model') {
            const inputEle = node as HTMLInputElement;
            inputEle.value = val;
            new Watcher(this.vm, key, new Method((val: string) => (inputEle.value = val)));
            inputEle.addEventListener('input', () => {
                this.vm[key] = inputEle.value;
            });
        } else if (attrName === 'click') {
            node.addEventListener(attrName, this.methods[key].bind(this.vm));
        }
    }

    private compileText(node: Node): void {
        const reg = /\{\{(.+?)\}\}/,
            value = node.textContent || '';

        if (reg.test(value)) {
            let key = RegExp.$1.trim();
            node.textContent = value.replace(reg, this.vm[key]);
            new Watcher(
                this.vm,
                key,
                new Method((val: string) => {
                    node.textContent = value.replace(reg, val);
                }),
            );
        }
    }

    private compileElement(node: HTMLElement): void {
        if (node.attributes.length) {
            Array.from(node.attributes).forEach((attr) => {
                let attrName = attr.name;
                if (this.isDirective(attrName)) {
                    attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2);
                    let key = attr.value;
                    this.update(node, key, attrName, this.vm[key]);
                }
            });
        }
    }

    private isDirective(dir: string) {
        return dir.startsWith('v-');
    }

    private isTextNode(node: Node) {
        return node.nodeType === 3;
    }

    private isElementNode(node: Node) {
        return node.nodeType === 1;
    }
}
