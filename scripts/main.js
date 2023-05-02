const searchBox = document.getElementById('top-search');
const resultElem = document.getElementById('activity');
const musicElem = document.getElementById('music');
const activityQueryURLBase = "http://www.boredapi.com/api/activity?type=";
const typeIdPair = {"education": "0vvXsWCC9xrXsKd4FyS8kM", "recreational": "37i9dQZF1DXdxcBWuJkbcy", "social": "37i9dQZF1EIdzRg9sDFEY3", 
"diy": "53d3oOp9lF6uXrG5jFLRqC", "charity": "37i9dQZF1EIgbU0EpV42y4", "cooking": "37i9dQZF1EIcPqD4jq1AIu", 
"relaxation": "37i9dQZF1DWZhzMp90Opmn", "music": "37i9dQZF1DX4JAvHpjipBk", "busywork": "37i9dQZF1DXcsT4WKI8W8r"};
let authToken;
let spotifyReqID;
let activityType;
let activity;

//searchbox listener
searchBox.onsubmit = (ev) => {
  ev.preventDefault();
  activityType = ev.srcElement.children[0].value.toLowerCase().trim(); // get search input
  ev.srcElement.children[0].value = '';                             // clear search input

  //bored api request
  if (activityType) { 
    boredapiRequest.open('GET', `${activityQueryURLBase}${activityType}`);
    boredapiRequest.send();
  }
  // setTimeout(() => {console.log(activity)}, 25);

}

const boredapiRequest = new XMLHttpRequest();
boredapiRequest.addEventListener("load", function (ev) { //step 1
  const structuredData = JSON.parse(ev.target.responseText);
  activity = structuredData.activity;
  if (activity) {
    resultElem.innerText = activity + "!";
  } else {
    resultElem.innerText = "Oops! That's not a valid type!";
  }

  spotifyapiRequest();
});

async function spotifyapiRequest() {
  activityType === 'education' ? spotifyReqID = typeIdPair.education :
  activityType === 'recreational' ? spotifyReqID = typeIdPair.recreational :
  activityType === 'social' ? spotifyReqID = typeIdPair.social :
  activityType === 'diy' ? spotifyReqID = typeIdPair.diy :
  activityType === 'charity' ? spotifyReqID = typeIdPair.charity :
  activityType === 'cooking' ? spotifyReqID = typeIdPair.cooking :
  activityType === 'relaxation' ? spotifyReqID = typeIdPair.relaxation :
  activityType === 'music' ? spotifyReqID = typeIdPair.music :
  activityType === 'busywork' ? spotifyReqID = typeIdPair.busywork : 0;

  authToken = localStorage.getItem('access_token');
  let response;

  if (authToken) {
  response = await fetch(`${"https://api.spotify.com/v1/playlists/"}${spotifyReqID}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
  } else {
    console.log("bad auth token");
  }

  const data = await response.json();
  // playlist name = data.name
  // playlist link = data.external_urls.spotify
  // playlist img url = data.images[0].url
}


const clientId = '62183f2ce9324f4abbd4c638748fa7bf';
const redirectUri = 'http://localhost:5500';
// const redirectUri = 'https://zorgusn.github.io/343p3-BoredSpotify/';



const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
 
if(!code) {
  let codeVerifier = generateRandomString(128);
  localStorage.setItem('code_verifier', codeVerifier);
  generateCodeChallenge(codeVerifier).then(codeChallenge => {

    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email';


    let args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    window.location = 'https://accounts.spotify.com/authorize?' + args;
  });

}else {

  let codeVerifier = localStorage.getItem('code_verifier');

  let body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier
  });
  
  const response = fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body
  }).then(response => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
      return response.json();
  }).then(data => {
    localStorage.setItem('access_token', data.access_token);
  }).catch(error => {
      console.error('Error:', error);
  });
}


function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}