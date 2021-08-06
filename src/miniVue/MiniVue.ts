import { Compiler } from './Compiler/Compiler';
import { Helper } from './helper/Helper';
import { Observer } from './response/Observer';
import { IVueOptions } from './types/types';

export class MiniVue {
    [key: string]: any;

    public $options!: IVueOptions<MiniVue>;
    public $el!: HTMLElement | null;
    public $data: any;
    public $methods!: Object;

    constructor(options: IVueOptions<MiniVue>) {
        if (!Helper.isObject(options.data)) {
            throw new Error('data 必须是一个对象，因为数组、方法功能还没实现');
        }

        this.$options = options;
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        this.$data = options.data;
        this.$methods = options.methods;

        //  data 每一个值赋值在 this上
        this.proxyData(options.data);
        new Observer(this.$data);
        new Compiler(this);
    }

    private proxyData(data: any): void {
        for (const key in data) {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key];
                },
                set(value) {
                    if (data[key] === value || Helper.isNaN(value, data[key])) {
                        return;
                    }
                    data[key] = value;
                },
            });
        }
    }
}
