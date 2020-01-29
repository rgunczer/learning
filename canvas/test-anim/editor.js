
(function () {

    for (let i = 0; i < wheel.slices.length; ++i) {

        const elemColorPicker = document.querySelector('#slice-' + i + '-color');

        if (wheel.slices[i].color.startsWith('#')) {
            elemColorPicker.value = wheel.slices[i].color;
        } else {
            const arr = wheel.slices[i].color.split(',');
            const r = parseInt(arr[0], 10);
            const g = parseInt(arr[1], 10);
            const b = parseInt(arr[2], 10);
            elemColorPicker.value = rgbToHex(r, g, b);
        }

        elemColorPicker.addEventListener('change', (event) => {

            console.log('slice ' + i + ' color changed', event.target.value);

            wheel.slices[i].color = event.target.value;

            draw();
        });

        const elemText = document.querySelector('#slice-' + i + '-text');

        elemText.value = wheel.slices[i].text;

        elemText.addEventListener('input', (event) => {

            console.log('slice ' + i + ' text changed', event.target.value);

            wheel.slices[i].text = event.target.value;

            draw();
        });
    }

    const elemOuterRingColor = document.querySelector('#outer-ring-color');

    elemOuterRingColor.value = wheel.outerRing.color;

    elemOuterRingColor.addEventListener('change', (event) => {

        console.log('outer ring color changed', event.target.value);

        wheel.outerRing.color = event.target.value;

        draw();

    });

    const elemOuterRingSize = document.querySelector('#outer-ring-size');

    elemOuterRingSize.value = wheel.outerRing.size;

    elemOuterRingSize.addEventListener('change', (event) => {

        console.log('outer ring size changed', event.target.value);

        wheel.outerRing.size = event.target.value;

        draw();
    });
})();
