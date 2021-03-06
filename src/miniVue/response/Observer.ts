import { Helper } from '../helper/Helper';
import { Dep } from './Dep';

/**
 * Observer 主要是用来监视 vm.$data 的变化，并且在变化时通知与其相关的 Watcher 来运行回调函数。
 */
export class Observer {
    constructor(data: any) {
        this.walk(data);
    }

    /**
     * 遍历 data 并注册
     */
    private walk(data: any): void {
        if (!Helper.isObject(data)) {
            return;
        }
        for (const key in data) {
            this.defineReactive(data, key, data[key]);
        }
    }

    /**
     * 拦截 data 上的每一个值
     * getter 添加订阅，setter 如果变更则发布通知
     */
    private defineReactive(obj: any, key: string, val: any): void {
        const self = this;
        // 对象内可能还有对象，也要遍历下
        this.walk(val);
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,

            get() {
                Dep.target && dep.add(Dep.target);
                return val;
            },

            set(newVal) {
                if (val === newVal || Helper.isNaN(val, newVal)) {
                    return;
                }
                val = newVal;
                self.walk(val);
                dep.notify();
            },
        });
    }
}
