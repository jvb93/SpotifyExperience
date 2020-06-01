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

exports.searchGenius = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    let token = functions.config().genius.access_token;

    let headers = {
      authorization: `Bearer ${token}`
    };

    var url = `https://api.genius.com/search?q=${encodeURIComponent(
      request.query.q
    )}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: headers
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

exports.song = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    let token = functions.config().genius.access_token;

    let headers = {
      authorization: `Bearer ${token}`
    };

    var url = `https://api.genius.com/songs/${request.query.id}?text_format=html`;
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: headers
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

exports.artist = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    let token = functions.config().genius.access_token;

    let headers = {
      authorization: `Bearer ${token}`
    };

    var url = `https://api.genius.com/artists/${request.query.id}?text_format=html`;
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: headers
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
