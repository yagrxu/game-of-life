function Player() {
    this.name = "";
    this.points = 5;
    this.initPoints = 10;
    this.perRoundNewPoint = 2;
    this.playerColor = "blue";
    this.status = "running";
    this.playerCacheMap = Array.from({ length: height }, () => Array(width).fill(0));
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
