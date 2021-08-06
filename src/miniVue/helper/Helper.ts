export class Helper {
    public static isNaN(a: any, b: any): boolean {
        return Number.isNaN(a) && Number.isNaN(b);
    }

    /**
     * 是否是对象
     */
    public static isObject(o: any): boolean {
        return o && typeof o === 'object';
    }
}
