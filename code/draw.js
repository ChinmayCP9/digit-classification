let painting = false;

function load_canvas() {
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", finishPainting);
    canvas.addEventListener("mousemove", draw);

    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    canvas.style.cursor = "crosshair";

    let clear = document.getElementById("clear");
    clear.onclick = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let small_canvas = document.getElementById("small-canvas");
        small_canvas.getContext("2d").clearRect(0, 0, small_canvas.width, small_canvas.height);
    };

    document.onmousemove = function(e) {
        let rect = canvas.getBoundingClientRect();
        if (e.clientX >= rect.right || e.clientX <= rect.left ||
            e.clientY >= rect.bottom || e.clientY <= rect.top) {
            finishPainting();
        }
    };
}

function startPainting(e) {
    painting = true;
    draw(e);
}

function finishPainting() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    let rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function check_if_canvas_empty() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    for (let i = 0; i < imageData.data.length; i++) {
        sum += imageData.data[i];
    }
    return sum === 0;
}

function display_input_tensor() {
    let imageData_scaled = extract(ctx.getImageData(0, 0, canvas.width, canvas.height));
    let small_canvas = document.getElementById("small-canvas");
    let newImageData = small_canvas.getContext("2d").createImageData(28, 28);
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            newImageData.data[i * 4 * 28 + j * 4 + 3] = imageData_scaled[i][j];
        }
    }
    small_canvas.getContext("2d").putImageData(newImageData, 0, 0);
}

function show_loading_overlay() {
    $("#canvas").LoadingOverlay("show", {
        background: "rgba(255, 255, 255, 0.5)"
    });
}

function hide_loading_overlay() {
    $("#canvas").LoadingOverlay("hide", true);
}

// todo add charts to show probabilities