function Player() {
    this.name = "";
    this.id = 0;
    this.status = "running"; //waiting
    this[SELECTED_TILE_TYPE.VILLAGE] = null;
    this[SELECTED_TILE_TYPE.CANNON] = null;
    this.points = 5;
    this.playerCacheMap = Array.from({ length: GameConstants.height }, () => Array(GameConstants.width).fill(0));
    this.initPoints = 10;
    this.perRoundNewPoint = 3;
    this.playerColor = "blue";
    this.init = function (id, points, perRoundNewPoint, playerColor, name, villageIcon, cannonIcon) {
        this.id = id;
        this.perRoundNewPoint = perRoundNewPoint;
        this.points = points;
        this.playerColor = playerColor;
        this.name = name;
        this[SELECTED_TILE_TYPE.VILLAGE] = villageIcon;
        this[SELECTED_TILE_TYPE.CANNON] = cannonIcon
    };
    this.newRound = function () {
        this.status = 'running';
        this.points += this.perRoundNewPoint;
        this.playerCacheMap = Array.from({ length: GameConstants.height }, () => Array(GameConstants.width).fill(0));
    };
    this.toData = function () {
        let updatePoints = [];
        for (let i = 0; i < GameConstants.height; i++) {
            for (let j = 0; j < GameConstants.width; j++) {
                if (this.playerCacheMap[i][j] != 0){
                    updatePoints.push({
                        "width": j,
                        "height": i,
                        "content": this.playerCacheMap[i][j]
                    });
                }
            }
        }
        return {
            'id': this.id,
            'status': this.status,
            'points': this.points,
            'updateMap': this.playerCacheMap,
            'updatePoints': updatePoints,
        }
    };
}
