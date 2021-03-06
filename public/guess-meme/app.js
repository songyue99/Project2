//connect to socket
let socket = io();

socket.on('connect', () => {
    console.log('connect to the server');
})

// let dialectX = 20;
// let dialectY = 20;
// let otherY = 100;

//hide input box and guesser buttons at first
document.getElementById('dialect-sound').style.display = "none";
document.getElementById('guess-which-meme').style.display = "none";

//make scroll to top button
let scrollToTop = document.getElementById('btnScrollToTop');
scrollToTop.addEventListener('click', () => {
    window.scrollTo(0, 0);
})

//when descriver click a buzzword button, hide buttons, display corresponding meme, and show input box
let dialect, appear, memeImg, numI;
let gameDescriber = false;
for (let i = 1; i < 6; i++) {
    document.getElementById("d" + i).addEventListener('click', () => {
        //display corresponding meme
        dialect = document.getElementById("d" + i).innerHTML;
        appear = document.createElement('h3');
        memeImg = document.createElement('img');
        let imgJpeg = "images/" + i + ".jpeg";
        memeImg.src = imgJpeg;
        appear.innerHTML = dialect;
        document.getElementById('meme-sec').appendChild(appear);
        document.getElementById('meme-sec').appendChild(memeImg);

        //show input box and change placeholder
        document.getElementById("dialect-sound").style.display = "block";
        document.getElementsByName('sound')[0].placeholder = 'describe the meme';

        //show corresponding instructions
        document.getElementById('instruction').innerHTML = "๐ Describe the meme in your dialect<br>๐ ็จไฝ ็ๆน่จๆ่ฟฐ่ฟไธช่กจๆๅ ";

        //hide buzzword buttons
        document.getElementById("choose-dialect").style.display = "none";
        document.getElementById("guesser-sec").style.display = "none";

        gameDescriber = true;
        numI = i;
    })
}

//when guesser click the button, hide button, show list of memes, show input box
document.getElementById("guesser").addEventListener('click', () => {
    //hide previous instructions
    document.getElementById("choose-dialect").style.display = "none";
    document.getElementById("guesser-sec").style.display = "none";

    //show input box, change placeholder text
    document.getElementsByName('sound')[0].placeholder = 'ask the describer questions';
    document.getElementById("dialect-sound").style.display = "block";

    //change instruction
    document.getElementById('instruction').innerHTML = "๐ฅธ Guess which the meme it is<br>๐ ็็่ฟๆฏๅชไธช่กจๆๅ ";

    //show the list of memes
    for (let i = 1; i < 6; i++) {
        let imgJpeg = "images/" + i + ".jpeg";
        let memes = document.createElement('img')
        memes.src = imgJpeg;
        let buzzword = document.getElementById("d" + i).innerHTML;
        let buzz = document.createElement('h3');
        buzz.innerHTML = buzzword;
        document.getElementById('meme-sec').appendChild(buzz);
        document.getElementById('meme-sec').appendChild(memes);
    }

    //show meme buttons
    document.getElementById('guess-which-meme').style.display = "block";
})


//record input text and player role to send to server
let diaButton = document.getElementById("ok");
let thisIsText = ["Welcome to the game!"];
let w = 0;
diaButton.addEventListener('click', () => {
    let userNameData = document.getElementById('userName').value;
    let diaDescription = document.getElementById('sound').value;
    let dialectObj = {
        userName: userNameData,
        sound: diaDescription,
        popWord: dialect,
        number: numI,
        gameRole: gameDescriber
    }
    console.log(dialectObj);
    socket.emit('clientDialect', dialectObj);

    //clear input box after sending a text
    document.getElementById('sound').value = '';
})

//get data from server
socket.on('serverDialect', (data) => {
    if (data.gameRole == true) {
        thisIsText[w] = data.userName + " (Describer) : " + data.sound;
    } else {
        thisIsText[w] = data.userName + " (Guesser) : " + data.sound;
    }
    numI = data.number;
    for (let i = 1; i < 6; i++) {
        document.getElementById("g" + i).addEventListener('click', () => {
            if (data.number == i) {
                let correctAnswer = document.getElementById("g" + i).innerHTML;
                document.getElementById("instruction").innerHTML = "๐ฅณ๐ฅณ๐ฅณ Congratulations ๐ฅณ๐ฅณ๐ฅณ<br> You have guessed the meme correctly! <br> It is " + correctAnswer + ". <br> Thank you so much for participating. <br> Wish it has been fun learning another dialect. <br> Now maybe try describing a meme with your own dialect! <br> โค๏ธ โค๏ธ โค๏ธ ";
                document.getElementById("guess-which-meme").style.display = "none";
                document.getElementById("dialect-sound").style.display = "none";
            }
        })
    }
    w += 1;
})

//display texts on canvas
let leon, controll, otherWord, otherMeme;
function init() {
    generateCanvas();

    const controll = {
        color: {},
        align: {},
    };

    leon = new LeonSans({
        text: "random text",
        color: ['#eae1df'],
        size: getSize(12),
        weight: 1,
        isWave: true,
        pathGap: 0.3,
        amplitude: 0.5,
        fps: 30
    });

    requestAnimationFrame(animate);
}

function animate(t) {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, sw, sh);

    const x = (sw - leon.rect.w) / 2 - 70;
    const y = (sh - leon.rect.h) / 2 - 870;

    for (let i = 0; i <= w; i++) {
        let newLeon = new LeonSans({
            text: thisIsText[i],
            color: ['#eae1df'],
            size: getSize(35),
            weight: 1,
            isWave: true,
            pathGap: 0.5,
            amplitude: 0.5,
            fps: 30
        });
        newLeon.position(x - 100 + moveX, y + (i * 50) - 200 + moveY);
        newLeon.wave(ctx, t);
    }
}

window.onload = () => {
    init();
};