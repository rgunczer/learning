const cloneDeep = require('clone-deep');

let obj = {
    a: 'apple',
    arr: [1, 2, 3]
};

let copy = cloneDeep(obj);

console.log(obj);
console.log(copy);

if (obj === copy) {
    console.log('equal')
} else {
    console.log('not equal')
}

copy.arr[0] = '9';

console.log(obj);
console.log(copy);
