  var config = {
    apiKey: "AIzaSyAtzmg1dG3fWTrispYckD18L0Wnz0RAGno",
    authDomain: "bonapetite-ffb65.firebaseapp.com",
    databaseURL: "https://bonapetite-ffb65.firebaseio.com",
    projectId: "bonapetite-ffb65",
    storageBucket: "bonapetite-ffb65.appspot.com",
    messagingSenderId: "695948248134"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var favRestaurants = [];
var wantToGo = [];
var person;
var restaurants;
//pull all the nessecary information from the database
database.ref().on("value", function(snapshot) {
    snapshot.forEach(function(child){
      var key = child.key;
      restaurants = child.val().restaurants;
      console.log(restaurants);
    });
    //name = person.Preference.restaurantName
})
      function initMap() {
        var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 13
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(pos);
            var marker = new google.maps.Marker({
              position: pos,
              map: map
            });
            for(i=0; i < favRestaurants.length; i++) {
              var randPos = {lat: favRestaurants[i].lat, lng: favRestaurants[i].lng};
              var marker =  new google.maps.Marker({
                position: randPos,
                icon: iconBase + 'grn-stars.png',
                map: map
              });
            }  
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }


//make a function to pull all of the favorite restaurants from the database and push them into an array.

function addToLists() {
  for(i=0; i < restaurants.length; i++){
    var name = restaurants[i].name;
    var lat = restaurants[i].location.latitude;
    var lng = restaurants[i].location.longitude;
    var locationObject = {name:name, lat:lat, lng:lng};
    if(restaurants.type == 0) {
      favRestaurants.push(locationObject);
    } else {
      wantToGo.push(locationObject);
    }
  }  
}
$(document).ready(function() {

addToLists();
console.log(favRestaurants);
console.log("hi");
console.log(restaurants);
})

