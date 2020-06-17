const axios = require("axios");
export function NegotiateTokenInfo(code, isRefresh) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.VUE_APP_FIREBASE_FUNCTIONS_BASE}/authenticate`, {
        code: code,
        redirect_uri: process.env.VUE_APP_REDIRECTURL,
        grant_type: isRefresh ? "refresh_token" : "authorization_code"
      })
      .then(resp => {
        SetTokenInfo(resp.data, isRefresh ? code : null);
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
      if (new Date(parsed.expiry) < new Date()) {
        NegotiateTokenInfo(parsed.refreshToken, true)
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

export function SetTokenInfo(rawToken, refreshToken) {
  var token = new TokenInfo(
    rawToken.access_token,
    refreshToken ? refreshToken : rawToken.refresh_token,
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
