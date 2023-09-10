var uniqueHeights = Array.from({ length: 100 }, (_, index) => index + 1);

const canvas = document.getElementById("canvas");
const btn_randomize = document.getElementById("btn-randomize");
const btn_bubble_sort = document.getElementById("btn-bubble-sort");
const range_num_bars = document.getElementById("num-bars-range");
const hovered_bar_div = document.getElementById("bar-value-div");
const hovered_bar_span = document.getElementById("bar-value");
const btn_stop_sort = document.getElementById("btn-stop-sort");
const btn_insertion_sort = document.getElementById("btn-insertion-sort");
const btn_merge_sort = document.getElementById("btn-merge-sort");
const btn_selection_sort = document.getElementById("btn-selection-sort");
const btn_quick_sort = document.getElementById("btn-quick-sort");

var audioContext;

let is_sorting = false;

function onload() {
    ctx = canvas.getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    for (let i = uniqueHeights.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueHeights[i], uniqueHeights[j]] = [uniqueHeights[j], uniqueHeights[i]];
    }

    draw();

    var hoveredBarIndex = -1;

    canvas.addEventListener("mouseenter", () => {
        if (is_sorting)
            return;
        hovered_bar_div.style.opacity = "1";
    });

    canvas.addEventListener("mousemove", (event) => {
        if (is_sorting)
            return;

        // Calculate the width of each bar
        const barWidth = canvasWidth / uniqueHeights.length;

        // Check if the mouse is hovering over a bar
        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;
        const barIndex = Math.floor(x / barWidth);
        const barHeight = uniqueHeights[barIndex];
        const barX = barIndex * barWidth;
        const barY = canvasHeight - (barHeight / uniqueHeights.length) * canvasHeight;

        if (barIndex != hoveredBarIndex) {
            draw();
        }

        hoveredBarIndex = barIndex;

        hovered_bar_span.innerText = barHeight;

        ctx.fillStyle = "red";
        ctx.fillRect(barX, barY, barWidth, (barHeight / uniqueHeights.length) * canvasHeight);
    });

    canvas.addEventListener("mouseleave", () => {
        if (is_sorting)
            return;

        hovered_bar_div.style.opacity = "0";

        draw();
    });

    btn_randomize.addEventListener("click", () => {
        randomize();
    });

    btn_bubble_sort.addEventListener("click", () => {
        bubbleSort();
    });

    btn_insertion_sort.addEventListener("click", () => {
        insertion_sort();
    });

    btn_merge_sort.addEventListener("click", () => {
        merge_sort();
    });

    btn_selection_sort.addEventListener("click", () => {
        selection_sort();
    });

    btn_quick_sort.addEventListener("click", () => {
        quick_sort();
    });

    // Add value change listener to slider
    document.getElementById("num-bars-range").addEventListener("input", (event) => {
        uniqueHeights.length = event.target.value;
        randomize();
    });

    btn_stop_sort.addEventListener("click", () => {
        is_sorting = false;
        enable_elements();
    });
}

function draw_bar(index, color) {
    const barWidth = canvasWidth / uniqueHeights.length;
    ctx.fillStyle = color;
    ctx.fillRect(index * barWidth, canvasHeight - (uniqueHeights[index] / uniqueHeights.length) * canvasHeight, barWidth, (uniqueHeights[index] / uniqueHeights.length) * canvasHeight);
}

function draw() {
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calculate the width of each bar
        const barWidth = canvasWidth / uniqueHeights.length;

        // Clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw the bars
        uniqueHeights.forEach((barHeight, index) => {
            const x = index * barWidth;
            const y = canvasHeight - (barHeight / uniqueHeights.length) * canvasHeight;

            ctx.fillStyle = "black";
            ctx.fillRect(x, y, barWidth, (barHeight / uniqueHeights.length) * canvasHeight);
        });
    }
}

function randomize() {
    // Create an array with values from 1 to n
    uniqueHeights = Array.from({ length: uniqueHeights.length }, (_, index) => index + 1);

    // Fisher-Yates shuffle algorithm to randomize the array
    for (let i = uniqueHeights.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueHeights[i], uniqueHeights[j]] = [uniqueHeights[j], uniqueHeights[i]];
    }

    draw();
}

async function bubbleSort() {
    if (is_sorting)
        return;

    sort_start();

    n = uniqueHeights.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!is_sorting) {
                draw();
                return;
            }

            let a = uniqueHeights[j];
            let b = uniqueHeights[j + 1];

            // Change color of the bars being compared
            draw_bar(j, "blue");
            draw_bar(j + 1, "blue");

            // Apply sound effect
            play_sound(j);
            //play_sound(j+1);

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            if (a > b) {
                [uniqueHeights[j], uniqueHeights[j + 1]] = [b, a];
            }
            draw();
        }
    }
    sort_end();
}

function sort_start() {
    is_sorting = true;
    disable_elements();
}

async function sort_end() {
    for (let i = 0; i < uniqueHeights.length; i++) {
        const delay = document.getElementById("sort-delay-range").value;
        await new Promise(r => setTimeout(r, delay));

        play_sound(i);
        draw_bar(i, "green");
    }

    await new Promise(r => setTimeout(r, 1000));

    draw();
    enable_elements();
}

function disable_elements() {
    btn_randomize.disabled = true;
    btn_bubble_sort.disabled = true;
    range_num_bars.disabled = true;
    btn_stop_sort.disabled = false;
    btn_insertion_sort.disabled = true;
    hovered_bar_div.style.opacity = "0";
    btn_merge_sort.disabled = true;
    btn_selection_sort.disabled = true;
    btn_quick_sort.disabled = true;
}

function enable_elements() {
    is_sorting = false;
    btn_randomize.disabled = false;
    btn_bubble_sort.disabled = false;
    range_num_bars.disabled = false;
    btn_stop_sort.disabled = true;
    btn_insertion_sort.disabled = false;
    btn_merge_sort.disabled = false;
    btn_selection_sort.disabled = false;
    btn_quick_sort.disabled = false;
}

async function insertion_sort() {
    if (is_sorting)
        return;

    sort_start();

    for (let i = 1; i < uniqueHeights.length; i++) {
        let key = uniqueHeights[i];
        let j = i - 1;

        while (j >= 0 && uniqueHeights[j] > key) {
            if (!is_sorting) {
                draw();
                return;
            }

            // Change color of the bars being compared
            draw_bar(j, "blue");
            draw_bar(j + 1, "blue");
            draw_bar(i, "red");

            // Apply sound effect
            play_sound(j);

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            uniqueHeights[j + 1] = uniqueHeights[j];
            j = j - 1;

            draw();
        }
        draw_bar(j + 1, "green");
        const delay = document.getElementById("sort-delay-range").value;
        await new Promise(r => setTimeout(r, delay));
        uniqueHeights[j + 1] = key;
        draw();
    }

    sort_end();
}

async function merge_sort() {
    if (is_sorting)
        return;

    sort_start();

    async function merge(arr, l, m, r) {
        const n1 = m - l + 1;
        const n2 = r - m;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) {
            L[i] = arr[l + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = arr[m + 1 + j];
        }

        let i = 0;
        let j = 0;
        let k = l;

        while (i < n1 && j < n2) {
            if (!is_sorting) {
                draw();
                return;
            }

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }

            draw_bar(k, "blue");
            play_sound(k);
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            draw();
            k++;
        }

        while (i < n1) {
            if (!is_sorting) {
                draw();
                return;
            }

            arr[k] = L[i];
            draw_bar(k, "blue");

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            draw();
            i++;
            k++;
        }

        while (j < n2) {
            if (!is_sorting) {
                draw();
                return;
            }

            arr[k] = R[j];
            draw_bar(k, "blue");

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            draw();
            j++;
            k++;
        }
    }

    async function mergeSortHelper(arr, l, r) {
        if (l < r) {
            if (!is_sorting) {
                draw();
                return;
            }
            const m = Math.floor((l + r) / 2);

            await mergeSortHelper(arr, l, m);
            await mergeSortHelper(arr, m + 1, r);

            await merge(arr, l, m, r);
        }
    }

    await mergeSortHelper(uniqueHeights, 0, uniqueHeights.length - 1);

    sort_end();
}

function play_sound(arr_index) {
    // Create an AudioContext
    if (audioContext == null)
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'square'; // 8-bit-like square wave
    oscillator.frequency.setValueAtTime(
        //Math.random() * 2000 + 500, // Random frequency between 500 and 2500 Hz
        uniqueHeights[arr_index] / uniqueHeights.length * 1000,
        audioContext.currentTime
    );

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Set the volume

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.01); // Play for 10ms
}

async function selection_sort() {
    if (is_sorting) {
        return;
    }

    sort_start();

    const n = uniqueHeights.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (!is_sorting) {
                draw();
                return;
            }

            // Change color of the bars being compared
            draw_bar(j, "blue");
            draw_bar(minIndex, "blue");

            // Apply sound effect
            play_sound(j);
            //play_sound(minIndex);

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            if (uniqueHeights[j] < uniqueHeights[minIndex]) {
                minIndex = j;
            }
            draw();
        }

        // Swap the elements
        [uniqueHeights[i], uniqueHeights[minIndex]] = [uniqueHeights[minIndex], uniqueHeights[i]];
        draw_bar(i, "green");
    }

    sort_end();
}

async function quick_sort() {
    if (is_sorting) {
        return;
    }

    sort_start();

    async function partition(low, high) {
        const pivot = uniqueHeights[high];
        let i = low - 1;

        for (let j = low; j <= high - 1; j++) {
            if (!is_sorting) {
                draw();
                return;
            }

            // Change color of the bars being compared
            draw_bar(i, "blue");
            draw_bar(j, "blue");
            draw_bar(low, "red");
            draw_bar(high, "red");

            // Apply sound effect
            play_sound(j);

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            if (uniqueHeights[j] < pivot) {
                i++;
                [uniqueHeights[i], uniqueHeights[j]] = [uniqueHeights[j], uniqueHeights[i]];
                draw_bar(i, "green");
                draw_bar(j, "green");
            }
            draw();
        }

        [uniqueHeights[i + 1], uniqueHeights[high]] = [uniqueHeights[high], uniqueHeights[i + 1]];
        return i + 1;
    }

    async function quickSortHelper(low, high) {
        if (!is_sorting) {
            draw();
            return;
        }
        if (low < high) {
            const pivotIndex = await partition(low, high);

            await quickSortHelper(low, pivotIndex - 1);
            await quickSortHelper(pivotIndex + 1, high);
        }
    }

    await quickSortHelper(0, uniqueHeights.length - 1);

    if (!is_sorting) {
        draw();
        return;
    }
    sort_end();
}

document.getElementById("debug").addEventListener("click", () => {
    // Create an AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Function to generate a random 8-bit sound for 10ms
    function playRandom8BitSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'square'; // 8-bit-like square wave
        oscillator.frequency.setValueAtTime(
            Math.random() * 2000 + 500, // Random frequency between 500 and 2500 Hz
            audioContext.currentTime
        );

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Set the volume

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.01); // Play for 10ms
    }

    // Function to play a burst of random 8-bit sounds
    function playBurstOfSounds(burstLength) {
        for (let i = 0; i < burstLength; i++) {
            setTimeout(playRandom8BitSound, i * 15); // Play a sound every 15ms
        }
    }

    // Call the function to play a burst of 8-bit sounds (adjust the burst length as needed)
    playBurstOfSounds(100); // Play 10 random sounds

});

window.addEventListener("load", onload);

