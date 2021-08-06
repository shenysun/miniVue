import { Watcher } from './Watcher';

/**
 * 依赖类
 */
export class Dep {
    public static target: any;
    private deps!: Set<Watcher>;

    constructor() {
        this.deps = new Set();
    }

    public add(dep: Watcher): void {
        if (dep && dep['update']) {
            this.deps.add(dep);
        }
    }

    public notify(): void {
        this.deps.forEach((dep) => dep.update());
    }
}
