import { MiniVue } from '../miniVue/MiniVue';
const vm = new MiniVue({
    el: '#app',
    data: {
        text: '白日依山尽，黄河入海流',
        count: 1,
    },
    methods: {
        handIncrease() {
            this.count++;
        },
        handReduce() {
            this.count--;
        },
    },
});
console.log(vm);
