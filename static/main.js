let arena;
let color;
let id;
let socket = io();
let myTurn = false;
let messageBox;

socket.on('find', (message) => {
    console.log(`found opponent ${message.opponentId},${message.isTurn}`);
    gameStarted = true;
    loop();
    arena.setOpponentId(message.opponentId);
    if (message.isTurn) {
        console.log(`requester`);
        messageBox.html('Your turn');
        myTurn = true;
    } else {
        console.log(`opponent`);
        arena.setPlayerColor('red');
        myTurn = false;
    }
});

socket.on('join', (message) => {
    console.log(`handshake done with server ${message.id}`);
    id = message.id;
    arena.setPlayerId(id);
});

socket.on('no-players', (message) => {
    messageBox.html(message.message);
});

socket.on('after-turn', (message) => {
    console.log(`after-turn event emitted`);
    arena.drawCircleForEvent(message.row, message.col, message.color);
    messageBox.html('Your turn');
    myTurn = message.myTurn;
});

socket.on('looser', (message) => {
    //arena.initBoard();
    myTurn = false;
    //console.log(`winner is ${message.opponent}`);
    messageBox.html('You loose..Please reset before finding a new game.');
    noLoop();
})

socket.on('draw', (message) => {
    noLoop();
    myTurn = false;
    arena.initBoard();
    messageBox.html(message.gameMessage);
});

let username;

function setup() {
    let cnv = createCanvas(350, 300);
    cnv.parent("gameContainer");
    messageBox = select('#gameMessage');
    arena = new Arena(6, 7);
    arena.setSocket(socket);
    arena.initBoard();
    noLoop();
}

function draw() {
    if (arena.getTotalMoves() >= 42) {
        myTurn = false;
        messageBox.html('it\'s a draw.Please reset before finding a new game.');
        socket.emit('draw',{
            opponent: arena.getOpponentId()
        });
        noLoop();
    }
    if (arena.checkWinner()) {
        //arena.initBoard();
        console.log(`looser is ${arena.getOpponentId()}, winner is ${arena.getPlayerId()}`);
        socket.emit('end',{
            winner:arena.getPlayerId(),
            looser:arena.getOpponentId()
        });
        noLoop();
        myTurn = false;
        messageBox.html('You win.Please reset before finding a new game.');
    }
    arena.draw();
}

function mouseClicked() {
    if (myTurn) {
        if (mouseX > 400 || mouseY > 400) {
            console.log("outside arena");
        } else {
            if(arena.click(mouseX, mouseY)) {
            messageBox.html('Waiting for opponent to play their turn');
            myTurn = false;
            } else {
                messageBox.html('only column click allowed');
            }
            //arena.click(mouseX, mouseY);
        }
    }
}

function find() {
    console.log("finding new game");
    arena.setPlayerColor('green');
    socket.emit('find');
}

function reset() {
    socket.emit('post-game', {
        id:arena.getPlayerId()
    });
    messageBox.html('');
    arena.initBoard();
    gameStarted = false;
    arena.draw();
}