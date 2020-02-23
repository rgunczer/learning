var foo = 'foo';

// kyle
(function(bar) {
    console.log('kyle: ' + bar);
})(foo);

// crockford
(function(bar) {
    console.log('crockford: ' + bar);
}(foo));


console.log(foo); // test comment