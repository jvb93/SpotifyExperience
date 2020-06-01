const functions = require("firebase-functions");
const axios = require("axios");
const qs = require("qs");

const cors = require("cors")({
  origin: true
});

exports.authenticate = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    let data = request.body;

    let authRequest = {
      grant_type: "authorization_code",
      code: data.code,
      redirect_uri: data.redirect_uri
    };

    let encoded = qs.stringify(authRequest);
    let concatTokens = `${functions.config().spotify.clientid}:${
      functions.config().spotify.clientsecret
    }`;

    let spotifyHeaders = {
      authorization: `Basic ${Buffer.from(concatTokens).toString("base64")}`,
      "content-type": `application/x-www-form-urlencoded`
    };

    return new Promise((resolve, reject) => {
      axios
        .post("https://accounts.spotify.com/api/token", encoded, {
          headers: spotifyHeaders
        })
        .then(res => {
          response.status(200).send(res.data);
          resolve();
          return 0;
        })
        .catch(e => {
          console.error(e);
          response.status(500).send({});
          reject(e);
        });
    });
  });
});
