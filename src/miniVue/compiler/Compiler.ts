import { Method } from '../helper/Method';
import { MiniVue } from '../MiniVue';
import { Watcher } from '../response/Watcher';

/**
 * 编译器，解析 {{}} v-model ...
 */
export class Compiler {
    private el: HTMLElement | null;
    private methods: any;

    constructor(private vm: MiniVue) {
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

    private compileText(node: Node): void {
        const matchReg = /(?<=\{\{)(.+?)(?=\}\})/g, // 不包含 {{}}
            replaceReg = /\{\{(.+?)\}\}/g, // 包含 {{}}
            textContent = node.textContent || '';
        let matchArray = textContent.match(matchReg);
        if (matchArray && matchArray.length) {
            const updateText = (): void => {
                let i = 0;
                node.textContent = textContent.replace(replaceReg, () => {
                    let key = matchArray![i++].trim();
                    return this.vm[key];
                });
            };

            matchArray.forEach((match) => {
                let key = match.trim();
                new Watcher(
                    this.vm,
                    key,
                    new Method((val: string) => {
                        updateText();
                    }),
                );
            });
            updateText();
        }
    }

    private compileElement(node: HTMLElement): void {
        if (node.attributes.length) {
            Array.from(node.attributes).forEach((attr) => {
                let attrName = attr.name;
                if (this.isDirective(attrName)) {
                    // 以 ‘v-’开头 v-on:click || v-model / v-text
                    attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2);
                } else if (attrName.startsWith('@')) {
                    // 以 ‘@’ 开头 @click
                    attrName = attrName.substr(1);
                } else {
                    return;
                }
                let key = attr.value;
                this.update(node, key, attrName, this.vm[key]);
            });
        }
    }

    /**
     * 处理各种指令
     * @param node 指令对应节点
     * @param key 指令名称对应的值 v-attrName=key
     * @param attrName 指令名称
     * @param val data[key] || methods[key]
     */
    private update(node: Node, key: string, attrName: string, val: any): void {
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

    private isDirective(dir: string): boolean {
        return dir.startsWith('v-');
    }

    private isTextNode(node: Node): boolean {
        return node.nodeType === 3;
    }

    private isElementNode(node: Node): boolean {
        return node.nodeType === 1;
    }
}
