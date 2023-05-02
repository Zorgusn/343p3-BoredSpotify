const searchBox = document.getElementById('top-search');
const resultElem = document.getElementById('activity');
const musicElem = document.getElementById('music');
const activityQueryURLBase = "http://www.boredapi.com/api/activity?type=";
let activityQueryURL;
let activity;

//searchbox listener
searchBox.onsubmit = (ev) => {
  ev.preventDefault();
  let activityType = ev.srcElement.children[0].value.toLowerCase(); // get search input
  ev.srcElement.children[0].value = '';                             // clear search input
  activityQueryURL = activityQueryURLBase + activityType;           // assemble boredAPI request

  //bored api request
  if (activityType) { 
    boredapiRequest.open("GET", `${activityQueryURL}`);
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
