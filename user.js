let users = new Map();

var userDao = {
    addUser:function (userId, socket) {
        console.log(`a user connected ${userId}`);
        users.set(userId, {
            socket: socket,
            inGame: false
        });
        socket.emit("join", {
            id: socket.id
          });
    },
    findOpponent:function(requesterId) {
        let id = null;
        console.log(`finding opponent for ${requesterId}, there are ${users.size} players online`);
        for (let [key, user] of users.entries()) {
            if (key!=requesterId && user.inGame===false) {
            id=key;
            break;
            }
          }
        return id;
    },
    cleanUp:function(socketId) {
        console.log(`removing key ${socketId}`);
        let user = users.get(socketId);
        user.socket.disconnect(true);
        users.delete(socketId);
    },
    updateInGameStatus:function(socketId, status) {
        console.log(`updating inGame status for ${socketId} with status ${status}`);
        users.get(socketId).inGame = status;
    },
    updateAndDisconnect:function(socketId) {
        console.log(`updateAndDisconnect for ${socketId} `);
        users.get(socketId).inGame = false;
        users.get(socketId).socket.disconnect();
    }
}

module.exports = userDao;