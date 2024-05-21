var Enum = require('enum');
const rules = require("./rules");

var GameData = {
    "height": 15,
    "width": 30
}
function ServerInfo(){
    this.players = [];
    this.gameData = {
        playerData: {
            players:[]
        },
        mapData: Array.from({ length: GameData.height }, () => Array(GameData.width).fill(0)),
        timeouts: []
    };
    this.history = [];
    this.backup = async function(){};
}

function handleActions(request, serverInfo){
    body = request.body;
    action_id = body.action_id;
    switch(action_id){
        case Action.UPDATE.value:
            return handleUpdate(serverInfo, body.data, body.data_type)
        case Action.GET_DATA.value:
            break;
        case Action.NEW_ROUND.value:
            break;
    }
}

function handleUpdate(serverInfo, data, data_type){
    serverInfo.players = data.players
    players = data.players;
    nextRound = true;
    for(var i = 0; i < players.length; i++) {
        if (players[i].status === 'running') {
            nextRound = false;
            break;
        }
    }
    console.log("next round:", nextRound);
    if (nextRound) {
        if (data.initial === true) {
            serverInfo.gameData.mapData = Array.from({ length: GameData.height }, () => Array(GameData.width).fill(0));
        }
        var calculatedResult = rules.getNextGeneration({
            "width": GameData.width, 
            "height": GameData.height,
            "mapData": serverInfo.gameData.mapData
        }, serverInfo.players);
        serverInfo.gameData.mapData = calculatedResult.mapData;

        console.log(calculatedResult.ended)
        return {
            'game_over': calculatedResult.game_status,
            'next_round': nextRound,
            map: serverInfo.gameData.mapData
        }
        
    }
    return {
        'next_round': nextRound,
    };
}

var Action = new Enum({'UPDATE': 1, 'GET_DATA': 2, 'NEW_ROUND': 3 });

module.exports = { handleActions, ServerInfo };