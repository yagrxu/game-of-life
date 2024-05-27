// import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"; // ES Modules import
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const https = require('https');

async function getParameter() {
    const client = new SSMClient({
        region: process.env.AWS_DEFAULT_REGION || 'us-east-1'
    });
    const input = { // GetParameterRequest
      Name: "image-generator-api-domain", // required
      WithDecryption: true,
    };
    const command = new GetParameterCommand(input);
    const response = await client.send(command);
    console.log(response.Parameter.Value);
    return response.Parameter.Value;
}

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      }
  };

const imageIndex = 4;
async function generateContent(serverInfo) {
    let serverUrl = await getParameter();
    let cannonIndex = 0;
    let villageIndex = 0;

    async function sendCannonRequest() {
        if (cannonIndex >= imageIndex) {
            return sendVillageRequest();
        }

        const data = JSON.stringify({
            "type": "cannon",
            "server": process.env.SERVER_NAME,
            "player": "0" + (cannonIndex + 1)
        });

        return new Promise((resolve, reject) => {
            const req = https.request(`${serverUrl}images`, options, (res) => {
                res.on('data', (d) => {
                    if(serverInfo.imageServerUrl == null){
                        const parts = JSON.parse(d).imageUrl.split('/');
                        serverInfo.imageServerUrl = `https://${parts[0]}/${parts[1]}`;
                    }
                });
                res.on('end', () => {
                    setTimeout(() => {
                        cannonIndex++;
                        resolve(sendCannonRequest());
                    }, 10000); // Delay of 10 seconds
                });
            });

            req.on('error', (e) => {
                console.error(e);
                reject(e);
            });

            req.end(data);
        });
    }

    async function sendVillageRequest() {
        if (villageIndex >= imageIndex) {
            return;
        }

        const data = JSON.stringify({
            "type": "village",
            "server": process.env.SERVER_NAME,
            "player": "0" + (villageIndex + 1)
        });

        return new Promise((resolve, reject) => {
            const req = https.request(`${serverUrl}images`, options, (res) => {
                res.on('data', (d) => {
                    if(serverInfo.imageServerUrl == null){
                        const parts = JSON.parse(d).imageUrl.split('/');
                        serverInfo.imageServerUrl = `https://${parts[0]}/${parts[1]}`;
                    }
                });
                res.on('end', () => {
                    setTimeout(() => {
                        villageIndex++;
                        resolve(sendVillageRequest());
                    }, 10000); // Delay of 10 seconds
                });
            });

            req.on('error', (e) => {
                console.error(e);
                reject(e);
            });

            req.end(data);
        });
    }

    await sendCannonRequest();
}


module.exports = { generateContent };