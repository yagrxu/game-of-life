function Player() {
    this.name = "";
    this.points = 5;
    this.initPoints = 20;
    this.perRoundNewPoint = 2;
    this.playerColor = "blue";
    this.grid = Array.from({ length: height }, () => Array(width).fill(0));
    this.init = function (points, perRoundNewPoint, playerColor, name) {
        this.perRoundNewPoint = perRoundNewPoint;
        this.points = points;
        this.playerColor = playerColor;
        this.name = name;
    };
    this.newRound = function () {
        this.points += this.perRoundNewPoint;
    };
}
