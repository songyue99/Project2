//open and connect to socket
let socket = io();

socket.on('connect', () => {
    console.log('connect to the server');
})

let dialectX = 20;
let dialectY = 20;
let otherY = 100;

let dialect, appear, memeImg, numI;
for (let i = 1; i < 6; i++) {
    document.getElementById("d" + i).addEventListener('click', () => {
        dialect = document.getElementById("d" + i).innerHTML;
        appear = document.createElement('h3');
        memeImg = document.createElement('img');
        let imgJpeg = "images/" + i + ".jpeg";
        memeImg.src = imgJpeg;
        appear.innerHTML = dialect;
        document.getElementById('meme-div').appendChild(appear);
        document.getElementById('meme-div').appendChild(memeImg);
        numI = i;
    })
}

let diaButton = document.getElementById("ok");
let thisIsText = ["Type something to start and guess what others are saying!"];
let w = 0;
diaButton.addEventListener('click', () => {
    let here = document.getElementById('where').value;
    let diaSound = document.getElementById('sound').value;
    let dialectObj = {
        where: here,
        sound: diaSound,
        popWord: dialect,
        number: numI
    }
    console.log(dialectObj);
    socket.emit('clientDialect', dialectObj);
})

let leon, controll, otherWord, otherMeme;
socket.on('serverDialect', (data) => {
    thisIsText[w] = data.where + " : " + data.sound;
    w += 1;
    // otherWord = document.createElement('h3');
    // otherWord.innerHTML = data.popWord;
    // otherMeme = document.createElement('img');
    //otherMeme.scr = "images/" + data.number + ".jpeg";
    //document.getElementById('meme-div').appendChild(otherWord);
    //document.getElementById('meme-div').appendChild(otherMeme);
})

function init() {
    generateCanvas();

    const controll = {
        color: {},
        align: {},
    };

    leon = new LeonSans({
        text: "Guess what others are saying",
        color: ['#eae1df'],
        size: getSize(20),
        weight: 1,
        isWave: true,
        pathGap: 0.3,
        amplitude: 0.5,
        fps: 30
    });
    //   const gui = new dat.GUI();
    //   //gui.add(leon, 'text');
    //   gui.add(leon, 'size', 20, 300);
    //   gui.add(leon, 'weight', 1, 300);
    //   gui.add(leon, 'pathGap', 0, 1);
    //   gui.add(leon, 'amplitude', 0, 1);
    //   //gui.add(leon, 'fps', 10, 60);

    requestAnimationFrame(animate);
}

function animate(t) {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, sw, sh);

    const x = (sw - leon.rect.w) / 2 - 500;
    const y = (sh - leon.rect.h) / 2 - 800;

    for (let i = 0; i <= w; i++) {
        let newLeon = new LeonSans({
            text: thisIsText[i],
            color: ['#eae1df'],
            size: getSize(45),
            weight: 1,
            isWave: true,
            pathGap: 0.5,
            amplitude: 0.5,
            fps: 30
        });
        if (i % 2 == 0) {
            newLeon.position(x + + i * 200 + moveX, y - 200 + moveY);
            newLeon.wave(ctx, t);
        } else {
            newLeon.position(x + (i - 1) * 200 + moveX, y - 150 + moveY);
            newLeon.wave(ctx, t);
        }
    }
}

window.onload = () => {
    init();
};