var uniqueHeights = Array.from({ length: 100 }, (_, index) => index + 1);

const canvas = document.getElementById("canvas");
const btn_randomize = document.getElementById("btn-randomize");
const btn_bubble_sort = document.getElementById("btn-bubble-sort");
const range_num_bars = document.getElementById("num-bars-range");
const hovered_bar_div = document.getElementById("bar-value-div");
const hovered_bar_span = document.getElementById("bar-value");

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
        const barY = canvasHeight - (barHeight / 100) * canvasHeight;

        if (barIndex != hoveredBarIndex) {
            draw();
        }

        hoveredBarIndex = barIndex;

        hovered_bar_span.innerText = barHeight;

        // Draw the bar in red
        ctx.fillStyle = "red";
        ctx.fillRect(barX, barY, barWidth, (barHeight / 100) * canvasHeight);
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
    
    // Add value change listener to slider
    document.getElementById("num-bars-range").addEventListener("input", (event) => {
        uniqueHeights.length = event.target.value;
        randomize();
    });
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
            const y = canvasHeight - (barHeight / 100) * canvasHeight;

            ctx.fillStyle = "black";
            ctx.fillRect(x, y, barWidth, (barHeight / 100) * canvasHeight);
        });
    }
}

function randomize() {
    // for (let i = uniqueHeights.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [uniqueHeights[i], uniqueHeights[j]] = [uniqueHeights[j], uniqueHeights[i]];
    // }

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
    console.log("Bubble sort started");

    sort_start();

    n = uniqueHeights.length;
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n - i - 1; j++) {
            let a = uniqueHeights[j];
            let b = uniqueHeights[j + 1];

            // Change color of the bars being compared
            ctx.fillStyle = "blue";
            const barWidth = canvasWidth / uniqueHeights.length;
            ctx.fillRect(j * barWidth, canvasHeight - (a / 100) * canvasHeight, barWidth, (a / 100) * canvasHeight);
            ctx.fillRect((j + 1) * barWidth, canvasHeight - (b / 100) * canvasHeight, barWidth, (b / 100) * canvasHeight);

            // Apply delay
            const delay = document.getElementById("sort-delay-range").value;
            await new Promise(r => setTimeout(r, delay));

            if(a > b) {
                [uniqueHeights[j], uniqueHeights[j + 1]] = [b, a];
                draw();
            }
        }
    }
    sort_end();
}

function sort_start() {
    is_sorting = true;
    btn_randomize.disabled = true;
    btn_bubble_sort.disabled = true;
    range_num_bars.disabled = true;
}

async function sort_end() {
    for(let i = 0; i < uniqueHeights.length; i++) {
        const delay = document.getElementById("sort-delay-range").value;
        await new Promise(r => setTimeout(r, delay));

        const barWidth = canvasWidth / uniqueHeights.length;
        ctx.fillStyle = "green";
        ctx.fillRect(i * barWidth, canvasHeight - (uniqueHeights[i] / 100) * canvasHeight, barWidth, (uniqueHeights[i] / 100) * canvasHeight);
    }

    await new Promise(r => setTimeout(r, 1000));

    draw();
    is_sorting = false;
    btn_randomize.disabled = false;
    btn_bubble_sort.disabled = false;
    range_num_bars.disabled = false;
}

document.getElementById("debug").addEventListener("click", () => {
    console.log(uniqueHeights);
});

window.addEventListener("load", onload);
