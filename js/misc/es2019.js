console.log('es2019 testZ');

function objectEntries() {
    console.log('----<[object entries]>----');

    const entries = Object.entries({
        first: 'Arnold',
        last: 'Schwarzenegger'
    });

    entries.forEach(([key, value]) => {
        console.log(`key: ${key}, value: ${value}`);
    });

    // console.log(entries);
    console.log(' ');
}

function objectFromEntries() {
    console.log('----<[object from entries]>----');

    const obj = Object.fromEntries([['name', 'apple'], ['age', 12]]);
    console.log(obj);

    console.log(' ');
}

objectEntries();

objectFromEntries();
