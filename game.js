/**
 * Created by J Won on 23/04/2017.
 */

var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var mySound;
var myMusic;

//function to run the game
function startGame() {
    myGamePiece = new sprite(60, 40, "pika.gif", 10, 120, "image");
    mySound = new sound("pikachu.wav");
    myMusic = new sound("pokemon-theme.mp3");
    myMusic.play();
    myBackground = new sprite(800, 400, "pokemonwallpaper.jpg", 0, 0, "background")
    myScore = new sprite("30px", "arial", "black", 600, 30, "text");
    myObstacle = new sprite(10, 200, "pink", 300, 120);

    myGameArea.start();
}

//setting up the canvas where the game will be played.
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 800;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        // setting up frame for counting multiple obstacles
        this.frameNo = 0

        this.interval = setInterval(updateGameArea, 20);

        //adding keydown and keyup function

        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

//setting up function for my game sprite
function sprite(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            }
        }
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

}

//creating function to update game area to make sure the movement is updated
function updateGameArea() {

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();
            myMusic.stop();
            myGameArea.stop();
            return;
        }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;

    //placing background
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();

    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;

        //randomising obstacles
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new sprite(10, height, "pink", x, 0));
        myObstacles.push(new sprite(10, x - height - gap, "pink", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

//updating score
    myScore.text = "SCORE: " + (myGameArea.frameNo);
    myScore.update();


    //creating speed functions initiated by controls
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
        myGamePiece.speedX = -5;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        myGamePiece.speedY = -5;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.speedX = 5;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        myGamePiece.speedY = 5;
    }

    myGamePiece.newPos();
    myGamePiece.update();
}

//adding sound

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
        myGamePiece.image.src = "hurtpika.gif";
    }
}



