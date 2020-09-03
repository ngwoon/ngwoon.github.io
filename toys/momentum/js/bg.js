const body = document.querySelector("body");

const IMG_NUMBER = 5;

function paintImage(imgNum) {
    const image = new Image();
    image.src = `./images/${imgNum}.jpg`;
    image.classList.add("bgImage");
    body.prepend(image);
}

function getRandom() {
    const number = Math.floor(Math.random()*IMG_NUMBER) + 1;
    return number;
}

function init() {
    const randNum = getRandom();
    paintImage(randNum);
}
init();