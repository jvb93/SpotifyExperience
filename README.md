# The Spotify Experience

[Demo Site](https://spotify-experience.web.app) | [Project Write-Up](https://vanbibber.org/Projects/SpotifyExperience.html)

![Node.js CI](https://github.com/jvb93/SpotifyExperience/workflows/Node.js%20CI/badge.svg)

## Running Locally 

### Prerequisites
- node.js, firebase tools
- vue cli preferred
- A Spotify app key and secret from [Spotify Developer's Portal](https://developer.spotify.com/)
- A Genius access token from [Genius.com](https://docs.genius.com/) 
- A firebase project on a paid tier to enable outbound networking
- The following frontend env variables:
  - VUE_APP_SPOTIFYCLIENTID = {{ your spotify client id }}
  - VUE_APP_SPOTIFYSCOPE = user-read-currently-playing,user-modify-playback-state
  - VUE_APP_REDIRECTURL = {{ your oAuth redirect URL }}
  - VUE_APP_FIREBASE_FUNCTIONS_BASE = {{ base URL to your firebase functions (auth, genius lookup) }}
- The following firebase env variables:
  - genius.access_token = {{ your genius.com access token }}
  - spotify.clientsecret = {{ your spotify client secret }}
  - spotify.clientid = {{ your spotify client id }}
- The firebase functions must be deployed and working while running the app locally, to enable auth negotiation

### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Deploy to Firebase
```
firebase deploy
```
