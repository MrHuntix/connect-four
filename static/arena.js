function Arena(maxRow, maxCol) {
	this.maxRow = maxRow;
	this.maxCol = maxCol;
	this.board = [];
	this.totalMoves = 0;
	this.winningSet = [];

	this.setSocket = function (socket) {
		this.socket = socket;
	}

	this.setPlayerId = function (playerId) {
		this.playerId = playerId;
	}

	this.setOpponentId = function (opponentId) {
		this.opponentId = opponentId;
	}

	this.getPlayerId = function () {
		return this.playerId;
	}

	this.getOpponentId = function () {
		return this.opponentId;
	}

	this.initBoard = function () {
		for (let r = 0; r < maxRow; r++) {
			this.board[r] = new Array(maxCol)
			for (let c = 0; c < maxCol; c++) {
				this.board[r][c] = new Box(c * 50, r * 50);
			}
		}
		this.totalMoves = 0;
		this.winningSet = [];
		console.log("board initialised");
	}

	this.changeBoxCircleColor = function (i, j, color) {
		this.board[i][j].setColor(color);
	}

	this.draw = function () {
		for (let r = 0; r < maxRow; r++) {
			for (let c = 0; c < maxCol; c++) {
				this.board[r][c].draw();
			}
		}
	}

	this.click = function (mX, mY) {
		if (mX >= 0 && mX <= (0 + 50) && mY >= 0 && mY <= (0 + 50)) {
			console.log(`column 1 clicked, mouse x ${mX}, mouse Y ${mY}`);
			this.drawCircle(0);
		}
		else if (mX >= 50 && mX <= (50 + 50) && mY >= 0 && mY <= (0 + 50)) {
			console.log(`column 2 clicked, mouse x ${mX}, mouse Y ${mY}`);
			this.drawCircle(1);
		}
		else if (mX >= 100 && mX <= (100 + 50) && mY >= 0 && mY <= (0 + 50)) {
			console.log(`column 3 clicked, mouse x ${mX}, mouse Y ${mY}`);
			this.drawCircle(2);
		}
		else if (mX >= 150 && mX <= (150 + 50) && mY >= 0 && mY <= (0 + 50)) {
			console.log(`column 4 clicked, mouse x ${mX}, mouse Y ${mY}`);
			this.drawCircle(3);
		}
		else if (mX >= 200 && mX <= (200 + 50) && mY >= 0 && mY <= (0 + 50)) {
			console.log(`column 5 clicked, mouse x ${mX}, mouse Y ${mY}`);
			this.drawCircle(4);
		}
		else if (mX >= 250 && mX <= (250 + 50) && mY >= 0 && mY <= (0 + 50)) {
			console.log(`column 6 clicked, mouse x ${mX}, mouse Y ${mY}`);
			this.drawCircle(5);
		}
		else if (mX >= 300 && mX <= (300 + 50) && mY >= 0 && mY <= (0 + 50)) {
			console.log(`column 7 clicked, mouse x ${mX}, mouse Y ${mY}`);
			this.drawCircle(6);
		} else {
			//alert('only column click allowed');
			return false;
		}
		return true;
	}

	this.drawCircle = function (column) {
		let drewCircle = false;
		for (let i = maxRow - 1; i > -1; i--) {
			if (!this.board[i][column].hasCircle()) {
				this.board[i][column].addCircle(true, this.playerColor);
				this.totalMoves += 1;
				drewCircle = true;
				socket.emit('on-turn', { row: i, col: column, opponent: this.opponentId, myTurn: true, color: this.playerColor });
				break;
			}
		}
		if (!drewCircle) {
			alert("unable to make move on selected box")
		}
	}

	this.drawCircleForEvent = function (i, column, color) {
		console.log(`drawing circle form event [${i}][${column}]`);
		if (!this.board[i][column].hasCircle()) {
			this.board[i][column].addCircle(true, color);
			drewCircle = true;
			//this.totalMoves+=1;
		}
	}

	this.setPlayerColor = function (color) {
		console.log(`setting player color to ${color}`);
		this.playerColor = color;
	}

	this.checkWinner = function () {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j <= 3; j++) {
				let rowMatched = this.row(i, j, this.playerColor);
				let colMatched = this.col(i, j, this.playerColor);
				let diagonalMatched = this.diagonal(i, j, this.playerColor);
				//console.log(`checked winner i:${i}, j:${j}, rowmatched: ${rowMatched}, colMatched ${colMatched}`);
				if (rowMatched || colMatched || diagonalMatched) {
					socket.emit('winner', {
						opponent: this.opponentId
					});
					return true;
				}
			}
		}
	}

	this.row = function (i, j, color) {
		let r1 = this.validBox(i, j, color) && this.validBox(i, j + 1, color) && this.validBox(i, j + 2, color) && this.validBox(i, j + 3, color);
		if (r1) {
			this.setWinningSet(i, j, i, j + 1, i, j + 2, i, j + 3);
			return r1;
		}
		let r2 = this.validBox(i + 1, j, color) && this.validBox(i + 1, j + 1, color) && this.validBox(i + 1, j + 2, color) && this.validBox(i + 1, j + 3, color);
		if (r2) {
			this.setWinningSet(i + 1, j, i + 1, j + 1, i + 1, j + 2, i + 1, j + 3);
			return r2;
		}
		let r3 = this.validBox(i + 2, j, color) && this.validBox(i + 2, j + 1, color) && this.validBox(i + 2, j + 2, color) && this.validBox(i + 2, j + 3, color);
		if (r3) {
			this.setWinningSet(i + 2, j, i + 2, j + 1, i + 2, j + 2, i + 2, j + 3);
			return r3;
		}
		let r4 = this.validBox(i + 3, j, color) && this.validBox(i + 3, j + 1, color) && this.validBox(i + 3, j + 2, color) && this.validBox(i + 3, j + 3, color);
		if (r4) {
			this.setWinningSet(i + 3, j, i + 3, j + 1, i + 3, j + 2, i + 3, j + 3);
			return r4;
		}
		return false;
		//console.log(`r1: ${r1}, r2: ${r2}, r3: ${r3}, r4: ${r4}, color: ${color}`);
		//return r1 || r2 || r3 || r4;
	}

	this.col = function (i, j, color) {
		let c1 = this.validBox(i, j, color) && this.validBox(i + 1, j, color) && this.validBox(i + 2, j, color) && this.validBox(i + 3, j, color);
		if (c1) {
			this.setWinningSet(i, j, i + 1, j, i + 2, j, i + 3, j);
			return c1;
		}
		let c2 = this.validBox(i, j + 1, color) && this.validBox(i + 1, j + 1, color) && this.validBox(i + 2, j + 1, color) && this.validBox(i + 3, j + 1, color);
		if (c2) {
			this.setWinningSet(i, j + 1, i + 1, j + 1, i + 2, j + 1, i + 3, j + 1,);
			return c2;
		}
		let c3 = this.validBox(i, j + 2, color) && this.validBox(i + 1, j + 2, color) && this.validBox(i + 2, j + 2, color) && this.validBox(i + 3, j + 2, color);
		if (c3) {
			this.setWinningSet(i, j + 2, i + 1, j + 2, i + 2, j + 2, i + 3, j + 2);
			return c3;
		}
		let c4 = this.validBox(i, j + 3, color) && this.validBox(i + 1, j + 3, color) && this.validBox(i + 2, j + 3, color) && this.validBox(i + 3, j + 3, color);
		if (c4) {
			this.setWinningSet(i, j + 3, i + 1, j + 3, i + 2, j + 3, i + 3, j + 3);
			return c4;
		}
		return false;
		//console.log(`c1: ${c1}, c2: ${c2}, c3: ${c3}, c4: ${c4}, color: ${color}`);
		//return c1 || c2 || c3 || c4;
	}

	this.diagonal = function (i, j, color) {
		let d1 = this.validBox(i, j, color) && this.validBox(i + 1, j + 1, color) && this.validBox(i + 2, j + 2, color) && this.validBox(i + 3, j + 3, color);
		if (d1) {
			this.setWinningSet(i, j, i + 1, j + 1, i + 2, j + 2, i + 3, j + 3);
			return d1;
		}
		j = j + 3;
		let d2 = this.validBox(i, j, color) && this.validBox(i + 1, j - 1, color) && this.validBox(i + 2, j - 2, color) && this.validBox(i + 3, j - 3, color);
		if (d2) {
			this.setWinningSet(i, j, i + 1, j - 1, i + 2, j - 2, i + 3, j - 3);
			return d2;
		}
		return false;
		// console.log(`d1: ${d1}, d2: ${d2}, color: ${color}`);
		//return d1 || d2;
	}

	this.validBox = function (i, j, color) {
		return this.board[i][j].hasCircle() && color === this.board[i][j].getColor();
	}

	this.getTotalMoves = function () {
		return this.totalMoves;
	}

	this.setWinningSet = function (x1, y1, x2, y2, x3, y3, x4, y4) {
		this.winningSet.push({
			x: x1,
			y: y1
		},
			{
				x: x2,
				y: y2
			},
			{
				x: x3,
				y: y3
			},
			{
				x: x4,
				y: y4
			}
		);
	}

	this.getInputSet = function () {
		return this.winningSet;
	}

}