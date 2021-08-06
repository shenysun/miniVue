export class Method {
    private func!: Function;
    private thisArg!: Object | undefined;
    private args!: Array<any>;

    public constructor(_func: Function, _thisArg?: Object, ..._args: Array<any>) {
        this.func = _func;
        this.thisArg = _thisArg;
        this.args = _args;
    }

    public setMethod(_func: Function, _thisArg: Object, ..._args: Array<any>): Method {
        this.func = _func;
        this.thisArg = _thisArg;
        this.args = _args;
        return this;
    }

    public apply(): any {
        return this.func.apply(this.thisArg, this.args);
    }

    public applyWith(data: Array<any>): any {
        if (data == null || this.length == 0) {
            return this.apply();
        }
        return this.func.apply(this.thisArg, this.args != null ? this.args.concat(data) : data);
    }

    public clone(): Method {
        return new Method(this.func, this.thisArg, this.args);
    }

    public get length(): number {
        return this.func.length;
    }
}
