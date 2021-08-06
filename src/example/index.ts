import { MiniVue } from '../miniVue/MiniVue';
const vm = new MiniVue({
    el: '#app',
    data: {
        count: 'hello',
    },
    methods: {
        onHandle() {
            console.log('handler click');
        },
    },
});
console.log(vm);
