const searchBox = document.getElementById('top-search');
const resultElem = document.getElementById('activity');
const musicElem = document.getElementById('music');
const activityQueryURLBase = "http://www.boredapi.com/api/activity?type=";
const typeIdPair = {"education": "0vvXsWCC9xrXsKd4FyS8kM", "recreational": "37i9dQZF1DXdxcBWuJkbcy", "social": "37i9dQZF1EIdzRg9sDFEY3", 
"diy": "53d3oOp9lF6uXrG5jFLRqC", "charity": "37i9dQZF1EIgbU0EpV42y4", "cooking": "37i9dQZF1EIcPqD4jq1AIu", 
"relaxation": "37i9dQZF1DWZhzMp90Opmn", "music": "37i9dQZF1DX4JAvHpjipBk", "busywork": "37i9dQZF1DXcsT4WKI8W8r"};
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
  spotifyReqID = 0;
  spotifyapiRequest.open('GET', `${"https://api.spotify.com/v1/playlists/"}${spotifyReqID}`);
  spotifyapiRequest.setRequestHeader('Authorization', `${"Bearer "}${authToken}`)
});

const spotifyapiRequest = new XMLHttpRequest();
spotifyapiRequest.addEventListener("load", function(ev) {
  const structuredData = JSON.parse(ev.target.responseText);
  console.log(structuredData);

});

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



// http://localhost:5500