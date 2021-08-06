import { Helper } from '../helper/Helper';
import { Method } from '../helper/Method';
import { MiniVue } from '../MiniVue';
import { Dep } from './Dep';

export class Watcher {
    private __old: any;
    constructor(private vm: MiniVue, private key: string, private cb: Method) {
        Dep.target = this;
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
