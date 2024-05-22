

const SELECTED_TILE_TYPE = {
    'VILLAGE': 'village',
    'CANNON': 'cannon'
};

function roundCleanup(players){
    for (var i=0; i<players.length; i){
        players[i].points = 0;
    }
}

function survival(mapData){

}

function handleCollisions(context, players, collisionEffect) {
    const grid = Array.from({ length: context.height }, () => Array.from({ length: context.width }, () => 0));
    // Populate the grid with player cells
    for (let row = 0; row < context.height; row++) {
        for (let col = 0; col < context.width; col++) {
            for (const player of players) {
                if (player.grid[row][col] !== 0) {
                    grid[row][col]++;
                }
            }
            if (grid[row][col] > 1) {
                collisionEffect(players, row, col);
            }
        }
    }
}

function collisionEffect(players, row, col) {

}

function handleCannonDamage(context) {
    let mapData = context.mapData;
    let cannoneList = [];
    for (let row = 0; row < context.height; row++) {
        for (let col = 0; col < context.width; col++) {
            if (mapData[row][col] != 0 && mapData[row][col].type === SELECTED_TILE_TYPE.CANNON) {
                cannoneList.push({
                    "height": row,
                    "width": col,
                    "content": mapData[row][col]
                });
            }
        }
    }

    for (let i = 0; i < cannoneList.length; i++) {
        let cannon = cannoneList[i];
        let destroyList = calculateDestroyVillages(context, cannon);
        for (let j = 0; j < destroyList.length; j++) {
            context.mapData[destroyList[j].height][destroyList[j].width] = 0;
        }
    }
}

function calculateDestroyVillages(context, cannon){
    let mapData = context.mapData;
    destroyList = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let row = (cannon.height + i);
            let col = (cannon.width + j);
            // destroy village only
            if (row < 0 || col < 0) {
                continue;
            }
            if (row >= context.height || col >= context.width) {
                continue;
            }
            console.log(mapData[row][col])
            if (mapData[row][col] == 0 || mapData[row][col].type != SELECTED_TILE_TYPE.VILLAGE) {
                continue;
            }
            
            if (mapData[row][col].id != cannon.content.id) {
                destroyList.push({
                    "height": row,
                    "width": col
                })
            }
        }
    }
    return destroyList;
}

function handleVilliageConvertion(players) {
    for (var i = 0; i < players.length; i++) {
        let player = players[i];
        console.log(player.updateMap)
    }
    // context.mapData
}

function validateNewPoints(players) {
    
}

function mergeData(context, players) {
    // console.log(players);
    context.conflicts = {};
    let mapData = context.mapData;
    for (var i = 0; i < players.length; i++) {
        let player = players[i];
        for(let pointIndex = 0;  pointIndex < player.updatePoints.length; pointIndex++) {
            point = player.updatePoints[pointIndex];
            if (mapData[point.height][point.width] === 0){
                mapData[point.height][point.width] = point.content
            }
            else {
                if(context.conflicts[point.height + "-" + point.width]){
                    context.conflicts[point.height + "-" + point.width]["conflicts"].push(point.content)
                }
                else {
                    context.conflicts[point.height + "-" + point.width] = {
                        "height": point.height,
                        "width": point.width,
                        "conflicts": [point.content]
                    };
                }
            }
        }
    }
    // console.log(context.mapData);
}

function getNextGeneration(context, players) {
    // console.log(players);
    // mergeData
    mergeData(context, players);

    // handle collisions (4,5)
    // handleCollisions(context, players, collisionEffect);

    // cannon damage
    handleCannonDamage(context)

    // run next round
    // handleVilliageConvertion(context, players);
    let survivalMap = {}
    for(var playerIndex = 0; playerIndex < players.length; playerIndex++){
        survivalMap[players[playerIndex].id] = 0;
    }
    console.log(survivalMap);
    let nextGrid = Array.from({ length: context.height }, () => Array.from({ length: context.width }, () => 0));
    let mapData = context.mapData;
    for (let i = 0; i < context.height; i++) {
        for (let j = 0; j < context.width; j++) {
            let result = countNeighbors(mapData, i, j, context.width, context.height);
            if (result !== null) {
                nextGrid[result.height][result.width] = {
                    "id": result.playerId,
                    "type": result.type
                };
                survivalMap[result.playerId] += 1;
            }
        }
    }
    ended = false;
    console.log(survivalMap);
    for(var playerIndex = 0; playerIndex < players.length; playerIndex++){
        if (survivalMap[players[playerIndex].id] == 0){
            ended = true;
            break;
        }
    }
    return {
        game_status: ended,
        mapData: nextGrid
    };
}

function countNeighbors(mapData, x, y, width, height) {
    let neighbors = {};
    let playerIds = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let row = (x + i);
            let col = (y + j);
            if (row < 0 || col < 0) {
                // console.log(x,y, "minus")
                continue;
            }
            if (row >= height || col >= width) {
                // console.log(x,y, "too big")
                continue;
            }
            // console.log(row, col, mapData)
            if (mapData[row][col] != 0) {
                // console.log(row, col)
                let playerId = mapData[row][col].id;
                if (neighbors[playerId] === undefined){
                    neighbors[playerId] = 0;
                    playerIds.push(playerId);
                }
                if (i !== 0 || j !== 0){
                    neighbors[playerId] ++;
                }
            }
        }
    }
    // console.log(neighbors);
    // console.log(playerIds);
    reproduce = [];
    keep = [];
    for (let i = 0; i < playerIds.length; i ++){
        let playerId = playerIds[i];
        // console.log(neighbors[playerId]);
        if (neighbors[playerId] > 3) {
            console.log(x, y, {
                "playerId": x + "-" + y,
                "type": "overwhelmed"
            })
            return null;
        }
        else if (neighbors[playerId] === 2) {
            keep.push(playerId);
        }
        else if (neighbors[playerId] === 3) {
            reproduce.push(playerId);
        }
    }
    // console.log(keep);
    // console.log(reproduce);
    // console.log(mapData[x][y])
    if(mapData[x][y] != 0 && (reproduce.length > 0 || keep.length > 0)) {
        if (reproduce.length >=2 || keep.length >= 2) {
            console.log(x, y, {
                "playerId": mapData[x][y].id,
                "type": "overwhelmed"
            })
            return null;
        }
        else if(keep.length == 1 && keep[0] === mapData[x][y].id){
            // console.log({
            //     "playerId": mapData[x][y].id,
            //     "type": "survival"
            // });
            return {
                "height": x,
                "width": y,
                "playerId": mapData[x][y].id,
                "type": "survival",
                "type": SELECTED_TILE_TYPE.VILLAGE
            };
        }
        console.log(x, y, {
            "playerId": mapData[x][y].id,
            "type": "dead"
        })
        return null;
        
    }
    else if (mapData[x][y] === 0 && reproduce.length == 1){
        console.log({
            "playerId": reproduce[0],
            "type": "reproduce"
        });
        return {
            "height": x,
            "width": y,
            "playerId": reproduce[0],
            "reason": "reproduce",
            "type": SELECTED_TILE_TYPE.VILLAGE
        }
    }
    // console.log({
    //     "playerId": x + "-" + y,
    //     "type": "unknown"
    // })
    return null;
}

module.exports = { getNextGeneration };