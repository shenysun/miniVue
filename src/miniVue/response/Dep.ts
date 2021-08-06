import { Watcher } from './Watcher';

/**
 * dependency 依赖类---收集订阅，发布通知
 */
export class Dep {
    public static target: any;
    // 所有订阅者
    private subs!: Set<Watcher>;

    constructor() {
        this.subs = new Set();
    }

    public add(dep: Watcher): void {
        if (dep && dep['update']) {
            this.subs.add(dep);
        }
    }

    public notify(): void {
        this.subs.forEach((dep) => dep.update());
    }
}
