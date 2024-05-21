const SELECTED_TILE_TYPE = {
    'VILLAGE': 'village',
    'CANNON': 'cannon'
};

const GameStatus = {
    WELCOME: 0,
    PLAYING: 1,
    GAME_OVER: 2,
    WAITING_FOR_SERVER_UPDATE: 99,
};

const GameConstants = {
    cellSize: 36,
    width: 30,
    height: 15,
}

const PlayerColor = [
    'green', 'blue', 'black', 'red', 'purple'
];

const PlayerName = [
    '火锅', '烧烤','春卷', '元宵', '豆包'
];

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function lowerFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}