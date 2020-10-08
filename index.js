let express = require('express');
let app = express();
const { env } = require('process');
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let userDao = require('./user');
var path = require('path');

let port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'static')));
app.get('/', (req, resp) => {
  resp.sendFile('index.html');
});

io.on('connection', (socket) => {
  userDao.addUser(socket.id, socket);

  socket.on('find', () => {
    let opponent = userDao.findOpponent(socket.id);
    if (opponent === null) {
      console.log(`no opponents`)
      io.to(socket.id).emit('no-players', {
        message: "no players available.You can open the game in another tab and practice with yourself."
      });
    }
    else {
      console.log(`emitting to ${socket.id}`);
      userDao.updateInGameStatus(socket.id, true);
      io.to(socket.id).emit('find', {
        isTurn: true,
        opponentId: opponent
      })
      console.log(`emitting to ${opponent}`);
      userDao.updateInGameStatus(opponent, true);
      io.to(opponent).emit('find', {
        isTurn: false,
        opponentId: socket.id
      })
    }
  });

  socket.on('post-game', (message)=>{
    console.log(`game started ${message.gameStarted}`);
    if(message.gameStarted) {
      console.log(`rage quit ${message.opponent}`);
      io.to(message.opponent).emit('rage-quit');
      userDao.updateInGameStatus(message.opponent, false);
      userDao.updateInGameStatus(message.id, false);
    } else {
      userDao.updateInGameStatus(message.id, false);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    userDao.cleanUp(socket.id);
  });

  socket.on('on-turn', (message) => {
    console.log(`row: ${message.row}, column: ${message.col}, opponent: ${message.opponent}`);
    io.to(message.opponent).emit('after-turn', {
      row:message.row,
      col:message.col,
      myTurn:true,
      color:message.color
    });
  });

  socket.on('end', (message)=>{
    console.log(`looser is ${message.looser}, winner is ${message.winner}`);
    //userDao.updateInGameStatus(message.looser, false);
    //userDao.updateInGameStatus(message.winner, false);
    io.to(message.looser).emit('looser', {
      winningSet:message.winningSet
    });
  });

  socket.on('draw', (message)=>{
    io.to(message.opponent).emit('draw', {
      gameMessage:'it\'s a draw.Click on reset and find new game'
    });
  });
});



http.listen(port, () => {
  console.log(`listening on port ${port}`);
});