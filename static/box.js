function Box(x, y) {
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 50;
	this.drawCircle = false;

	this.draw = function() {
		fill(255, 204, 0);
		rect(this.x, this.y, this.width, this.height);
		if(this.drawCircle) {
			fill(this.circleColor);
			circle(this.x+(this.width/2),this.y+(this.height/2), this.width);
		}	
	}

	this.addCircle = function(showCircle, color) {
		this.drawCircle = showCircle;
		this.circleColor = color;
	}

	this.hasCircle = function() {
		return this.drawCircle;
	}

	this.getColor = function() {
		return this.circleColor;
	}
}