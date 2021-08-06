import { Helper } from '../helper/Helper';
import { Dep } from './Dep';

/**
 * 观察者
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
