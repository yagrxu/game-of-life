const serverUrl = "";
//const serverUrl = "http://127.0.0.1:3000"

// function connect(url, callback){
//     $.get(url,callback);
// }

// function updatePlayer(playerData, path, callback){
//     $.ajax({
//         url: serverUrl + "/" + path,
//         type: 'post',
//         data: JSON.stringify(playerData),
//         headers: {
//             'Content-Type': "application/json"
//         },
//         dataType: 'json',
//         success: function (data) {
//             console.info(data);
//         }
//     })
// }

function updateData(data, path, callback){
    $.ajax({
        url: serverUrl + "/" + path,
        type: 'post',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': "application/json"
        },
        dataType: 'json',
        
    }).done(function (data) {
        callback(null, data);
    }).fail(function (error) {
        callback(error, data)
    })
}

function getInitData(path, callback){
    $.ajax({
        url: serverUrl + "/" + path,
        type: 'post',
        data: JSON.stringify({
            "action_id": 2
          }),
        headers: {
            'Content-Type': "application/json"
        },
        dataType: 'json',
        
    }).done(function (data) {
        callback(null, data);
    }).fail(function (error) {
        callback(error, data)
    })
}

function getNewRoundData(){

}