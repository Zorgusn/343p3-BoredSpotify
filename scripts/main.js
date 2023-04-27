const searchBox = document.getElementById('top-search');
const resultElem = document.getElementById('activity');
const musicElem = document.getElementById('music');
const activityQueryURLBase = "http://www.boredapi.com/api/activity?type=";
let activityQueryURL;
let activityType;
let activity;

//searchbox listener
searchBox.onsubmit = (ev) => {
  ev.preventDefault();
  activityType = ev.srcElement.children[0].value.toLowerCase(); // get search input
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