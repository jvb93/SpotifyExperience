const axios = require("axios");
export function NegotiateTokenInfo(code) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://us-central1-spotify-experience.cloudfunctions.net/authenticate",
        { code: code, redirect_uri: process.env.VUE_APP_REDIRECTURL }
      )
      .then(resp => {
        SetTokenInfo(resp.data);
        resolve(resp.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function GetTokenInfo() {
  return new Promise((resolve, reject) => {
    let tokenInfo = null;
    if (localStorage.tokenInfo) {
      var parsed = JSON.parse(localStorage.tokenInfo);
      if (parsed.expiry < new Date()) {
        NegotiateTokenInfo(parsed.refreshToken)
          .then(t => {
            resolve(t);
          })
          .catch(err => {
            reject(err);
          });
      }
      tokenInfo = parsed;
    }
    resolve(tokenInfo);
  });
}

export function SetTokenInfo(rawToken) {
  var token = new TokenInfo(
    rawToken.access_token,
    rawToken.refresh_token,
    rawToken.expires_in
  );
  localStorage.tokenInfo = JSON.stringify(token);
}

class TokenInfo {
  constructor(accessToken, refreshToken, expiresIn) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    let now = new Date();

    this.expiry = new Date(now.getTime() + expiresIn * 1000);
  }
}
