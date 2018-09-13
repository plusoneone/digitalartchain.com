const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 5000
const url = require('url');

// set the server to listen on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (request, response) => response.send(

    `This is Digital art Chain API server.
     You can access tokens information /tokens?tokenId=**** (**** is token ID) `

));

app.use('/', router);

router.get('/tokens', (request, response) => {

    var urlParts = url.parse(request.url, true);
    var parameters = urlParts.query;
    var tokenId = parameters.tokenId;
    var imageHash = parameters.ipfsHash;
    var imageUri;
    var imageFileType;

    var request = require('xhr-request');

    request(`https://ipfs.io/ipfs/${imageHash}`, {
        responseType: 'arraybuffer',
    }, function (err, data) {
        if (err) throw err
        
        // the JSON result
        var bytes = new Uint8Array(data);
        if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9) {
            imageFileType = "JPEG";
            imageUri = `https://ipfs.io/ipfs/${imageHash}`;
        } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
            imageFileType = "PNG";
            imageUri = `https://ipfs.io/ipfs/${imageHash}`;
        } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
            imageFileType = "GIF";
            imageUri = `https://ipfs.io/ipfs/${imageHash}`;
        } else {
            imageFileType = "OTHER";
            imageUri = `https://ipfs.io/ipfs/Qmf1wsKeSbjQf8aajZxdD47h15Mb8hpZaFxQPcchdfFUmx`;
        }

        response.json(
            {
                id: `${tokenId}`,
                title: 'Asset Metadata',
                file: `${imageFileType}`,
                type: 'object',
                name: `Digital Art ${tokenId}`,
                description: `Digital Art ${tokenId}`,
                imageUrl: `${imageUri}`
            });
    });
});