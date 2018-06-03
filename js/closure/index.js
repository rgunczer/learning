// Kyle Simpson
//
// Closure is when a function "remembers"
// its lexical scope even when a the function is
// executed outside that lexical scope


function foo() {
    var bar = "bar";

    function baz() {
        console.log(bar);
    }

    bam(baz);
}

function bam(baz) {
    baz(); // "bar"
}

foo();