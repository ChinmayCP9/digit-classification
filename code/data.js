function extract() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return centralize(imageData, scale(get_grey_scaled_image(imageData)));
}

function scale(image_grey_scaled) {
    let scaled_input = make_array([28, 28], 0);
    let scale = image_grey_scaled.length / 28;
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            scaled_input[i][j] = average_pixel(image_grey_scaled, i * scale, j * scale,
                                               (i + 1) * scale - 1, (j + 1) * scale - 1);
        }
    }
    return scaled_input;
}

function get_grey_scaled_image(imageData) {
    let imageData_grey_scaled = make_array([imageData.width, imageData.height], 0);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let x = Math.floor(i / 4 / canvas.width);
        let y = Math.floor(i / 4 % canvas.height);
        imageData_grey_scaled[x][y] = imageData.data[i + 3];
    }
    return imageData_grey_scaled;
}

function average_pixel(image, x, y, x_end, y_end) {
    let sum = 0;
    for (let i = x; i < x_end; i++) {
        for (let j = y; j < y_end; j++) {
            i = i | 0;
            j = j | 0;
            sum += image[i][j];
        }
    }
    return Math.floor(sum / ((x_end - x) * (y_end - y)));
}

let make_array = function(dims, arr) {
    if (dims[1] === undefined) {
        return new Array(dims[0]);
    }
    arr = new Array(dims[0]);

    for (let i = 0; i < dims[0]; i++) {
        arr[i] = new Array(dims[1]);
        arr[i] = make_array(dims.slice(1), arr[i]);
    }
    return arr;
};
