const functions = require("firebase-functions");
const axios = require("axios");

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

    let concatTokens = `${functions.config().spotify.clientid}:${
      functions.config().spotify.clientsecret
    }`;

    let spotifyHeaders = {
      authorization: `Basic ${Buffer.from(concatTokens).toString("base64")}`,
      "content-type": `application-json`
    };

    axios
      .post("https://accounts.spotify.com/api/token", authRequest, {
        headers: spotifyHeaders
      })
      .then(resp => {
        response.status(200).send(resp.data);
        return 0;
      })
      .catch(err => {
        console.log(err);
        return 1;
      });
  });
});
