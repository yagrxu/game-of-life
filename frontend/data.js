
let gameData = {
    gameStatus: GameStatus.WELCOME,
    currentPlayer: null,
    playerById: {

    },
    initial: true,
    players:[],
    imageServerUrl: './images/',
    selectedType: SELECTED_TILE_TYPE.VILLAGE,
    mapData: Array.from({ length: GameConstants.height }, () => Array(GameConstants.width).fill(0))
};
