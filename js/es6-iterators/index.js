function customIterator() {

    function myIterator(start, finish) {
        let index = start;
        let count = 0;

        return {
            next() {
                let result;
                if (index < finish) {
                    result = { value: index, done: false };
                    index += 1;
                    count++;
                    return result;
                }
                return {
                    value: count,
                    done: true
                };
            }
        }
    }

    const it = myIterator(0, 10);

    let res = it.next();

    while (!res.done) {
        console.log(res.value);
        res = it.next();
    }

    const it2 = myIterator(0, 10);

    for (let val, result; (result = it2.next()) && !result.done;) {
        val = result.value;
        console.log(val);
    }

}

function iteratorSymbol() {
    const arr = [0, 3, 5, 7, 9];

    let it = arr[Symbol.iterator]();

    console.log(it.next());
    console.log(it.next());
    console.log(it.next());
    console.log(it.next());
    console.log(it.next());
    console.log(it.next());

}

function mapSetIterator() {
    const map = new Map();
    map.set('key1', 'value 1');
    map.set('key2', 'value 2');
    const mapIterator = map[Symbol.iterator]();
    console.log(mapIterator.next().value);
    console.log(mapIterator.next().value);
    console.log(mapIterator.next().value);

    for (const [key, value] of map) {
        console.log(`${key} and ${value}`);
    }

    const mySet = new Set();
    mySet.add('uno');
    mySet.add('dos');

    const setIterator = mySet[Symbol.iterator]();
    console.log(setIterator.next());
    console.log(setIterator.next());
    console.log(setIterator.next());

    for (const value of mySet) {
        console.log(value);
    }

}

customIterator();
// iteratorSymbol();
// mapSetIterator();
