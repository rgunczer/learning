function caesarCipher(str, num) {
    let res = ''
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const numToAdd = num % alphabet.length;

    for (let i = 0; i < str.length; ++i) {
        const char = str[i].toLowerCase();
        if (char === ' ') {
            res += ' ';
        } else {
            const index = alphabet.indexOf(char);
            let nextIndex = index + numToAdd;
            if (nextIndex > alphabet.length - 1) {
                nextIndex = nextIndex - alphabet.length;
            }
            if (nextIndex < 0) {
                nextIndex = alphabet.length + nextIndex;
            }
            if (str[i] === str[i].toUpperCase()) {
                res += alphabet[nextIndex].toUpperCase();
            } else {
                res += alphabet[nextIndex];
            }
        }
    }
    return res;
}

const encrypted = caesarCipher('Banuk Shaman Camp', 2);
const encrypted1 = caesarCipher('Dcpwm Ujcocp Ecor', -2);
console.log(encrypted);
console.log(encrypted1);
