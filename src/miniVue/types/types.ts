/**
 * new miniVue -> options类型
 */
export interface IVueOptions<T> {
    el: string | HTMLElement;
    data: object;
    methods: { [key: string]: (this: T, ...args: any[]) => any };
}
