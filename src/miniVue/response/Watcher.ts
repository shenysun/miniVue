import { Helper } from '../helper/Helper';
import { Method } from '../helper/Method';
import { MiniVue } from '../MiniVue';
import { Dep } from './Dep';

/**
 * 注册监听 vm[key] 变化，等待 Observer 通知，执行 update 刷新 UI。
 */
export class Watcher {
    private __old: any; // 存取旧值

    constructor(private vm: MiniVue, private key: string, private cb: Method) {
        // 注册 watch 的时候，添加 target 标记。
        Dep.target = this;
        // vm[key] 取值触发 Observer getter ,将 this 添加到 dep.subs 中。
        this.__old = vm[key];
        Dep.target = null;
    }

    public update(): void {
        let newValue = this.vm[this.key];
        if (this.__old === newValue || Helper.isNaN(this.__old, newValue)) {
            return;
        }
        this.cb.applyWith(newValue);
        this.__old = newValue;
    }
}
