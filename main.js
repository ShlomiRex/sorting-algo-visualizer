var uniqueHeights = Array.from({ length: 100 }, (_, index) => index + 1);

const canvas = document.getElementById("canvas");
const btn_randomize = document.getElementById("btn-randomize");
const btn_bubble_sort = document.getElementById("btn-bubble-sort");
const range_num_bars = document.getElementById("num-bars-range");
const hovered_bar_div = document.getElementById("bar-value-div");
const hovered_bar_span = document.getElementById("bar-value");
const btn_stop_sort = document.getElementById("btn-stop-sort");
const btn_insertion_sort = document.getElementById("btn-insertion-sort");

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
        if(is_sorting)
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
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n - i - 1; j++) {
            if (!is_sorting) {
                draw();
                return;
            }

            let a = uniqueHeights[j];
            let b = uniqueHeights[j + 1];

            // Change color of the bars being compared
            draw_bar(j, "blue");
            draw_bar(j + 1, "blue");

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            if(a > b) {
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
    for(let i = 0; i < uniqueHeights.length; i++) {
        const delay = document.getElementById("sort-delay-range").value;
        await new Promise(r => setTimeout(r, delay));

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
}

function enable_elements() {
    is_sorting = false;
    btn_randomize.disabled = false;
    btn_bubble_sort.disabled = false;
    range_num_bars.disabled = false;
    btn_stop_sort.disabled = true;
    btn_insertion_sort.disabled = false;
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
            draw_bar(j+1, "blue");
            draw_bar(i, "red");

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            uniqueHeights[j + 1] = uniqueHeights[j];
            j = j - 1;

            draw();
        }
        draw_bar(j+1, "green");
        const delay = document.getElementById("sort-delay-range").value;
        await new Promise(r => setTimeout(r, delay));
        uniqueHeights[j + 1] = key;
        draw();
    }

    sort_end();
}

document.getElementById("debug").addEventListener("click", () => {
});

window.addEventListener("load", onload);

