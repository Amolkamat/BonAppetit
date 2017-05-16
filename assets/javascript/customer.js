var customerKey = "";
var pageDisplayCounter = 0;
var pageCounter = 0;
var flipBookPageDisplay = 2;
var restaurantName = "";

var favRestaurants = [];
var wantToGo = [];
var person;
var restaurants = [];

var customerObject = {

    "customerId": 0,
    "profile": {
        firstName: "",
        lastName: "",
        loginId: "",
        password: "",
        emailAddress: ""
    }

}



var customerList = [];

var customerKeyObject = {
    "key": "",
    "customerData": ""
};


$(document).ready(function() {

    $("#loginButton").on("click", function() {

        //Find if the username password matches.


        $.each(customerList, function(index, value) {

            console.log(value);
            if (value.customerData.profile.loginId === $("#username").val() && value.customerData.profile.password === $("#password").val()) {
                //Found Match for the correct customer


                customerKey = value.key;
                customerObject = value.customerData;
                console.log("Match found")
                console.log(JSON.stringify(value.customerData));

                //Modify the Screen information as per the current customer

                $("#dropDownName").text(customerObject.profile.firstName);
                $("#customerName").text(customerObject.profile.firstName + " " + customerObject.profile.lastName);
                $("#customerEmail").text(customerObject.profile.emailAddress);

                $(".wrapper").hide();
                $("#userWelcome").show();
                $(".navbar").show();

                //addToLists(customerObject.restaurants);


                restaurants = customerObject.restaurants;
                for (i = 0; i < restaurants.length; i++) {
                    console.log("call Loop" + i);
                    var name = restaurants[i].restaurantName;

                    var lat = restaurants[i].location.latitude;
                    console.log(lat);
                    var lng = restaurants[i].location.longitude;
                    var type = restaurants[i].type;
                    console.log(type);
                    var locationObject = {
                        name: name,
                        lat: lat,
                        lng: lng,
                        type: type
                    };

                    console.log(locationObject);
                    favRestaurants.push(locationObject);

                }


            }
            
        })

        //Clear contents
        $("#username").val("");
        $("#password").val("");

        console.log(favRestaurants);
            console.log("Call Init Map");
            initMap();
            $("#mapPanel").show();
        //Load the map automatically.


    })



    function initMap() {
        var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -34.397,
                lng: 150.644
            },
            zoom: 11
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
                for (i = 0; i < favRestaurants.length; i++) {
                    console.log("Count me Map" + i)
                    var randPos = {
                        lat: parseFloat(favRestaurants[i].lat),
                        lng: parseFloat(favRestaurants[i].lng)
                    };
                    if (favRestaurants[i].type == 0) {
                        var marker = new google.maps.Marker({
                            position: randPos,
                            icon: iconBase + 'grn-stars.png',
                            map: map
                        });
                    } else {
                        var marker = new google.maps.Marker({
                            position: randPos,
                            icon: iconBase + 'blu-stars.png',
                            map: map
                        });
                    }
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

    $("#registerSubmit").on("click", function() {

        //Validate input data and add the customer into Database

        //Add object to js domain object after validation
        customerObject.profile.firstName = $("#firstName").val();
        customerObject.profile.lastName = $("#lastName").val();

        customerObject.profile.loginId = $("#userName").val();
        customerObject.profile.emailAddress = $("#email").val();
        customerObject.profile.password = $("#passwordRegister").val();


        //Push customer if all values are good - 
        database.ref().push(customerObject);

        openModal();
        $(".wrapper").hide();
        $("#userWelcome").show();
        $(".navbar").show();
        closeModal();


    })


    //Initial Read and get the appropriate customer Objects
    database.ref().on("child_added", function(snapshot) {
        var dbCustomerObject = new Object();
        dbCustomerObject.key = snapshot.key;
        dbCustomerObject.customerData = snapshot.val();


        console.log(snapshot.val());

        customerList.push(dbCustomerObject);
        customerKey = snapshot.key;


    });

    $("#restaurantPanel").on("click", ".restaurantAdd", function() {

        //Get the key for Testing purposes.

        //Check if the restaurant id is not available already
        /*
        domtoimage.toJpeg(document.getElementById("test"), { quality: 0.95 })
    .then(function (dataUrl) {
        var link = document.createElement('a')
        
        URL = dataUrl;
        
        link.href = dataUrl;
        var $testCount= $("<div> <img id='image'> </div>");
        $("#hello").after($testCount);
        //link.click();
        $("#image").attr("src", URL);
        
    });  */




        //Add the restaurant object to Customer Id
        var selectedRestaurant = {
            type: "0",
            restaurantId: $(this).attr("data-restaurantId"),
            restaurantName: $(this).attr("data-restaurantName"),
            userRating: $(this).attr("data-rating"),
            cuisines: $(this).attr("data-cuisines"),
            image: $(this).attr("data-image"),
            "location": {
                latitude: $(this).attr("data-restaurantLatitude"),
                longitude: $(this).attr("data-restaurantLongitude"),
                address: $(this).attr("data-address")
            }
        }


        if (customerObject.restaurants == null) {
            customerObject.restaurants = [];
        }


        customerObject.restaurants.push(selectedRestaurant);




        database.ref("/" + customerKey + "/").update({

            restaurants: customerObject.restaurants

        })

        var cart = $('.dropdown');

        var imgtodrag = $("#" + $(this).attr("data-imageId"));
        console.log(imgtodrag);
        var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '100'
            })

            .appendTo($('body'))
            .animate({
                'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
            }, 1000);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function() {
            $(this).detach()
        });
        $(this).fadeOut("slow", function() {
            // Animation complete.
        });

        var parentRowId = $(this).attr("data-parentRow");

        $("." + parentRowId).fadeOut(500, function() {});

    })

    //BootStrap validator function

    //Sign Out Button - Clean up Script
    $("#signOut").on("click", function() {
        console.log("Sign out customer");
        $("#resPanel").hide();

        $("#userWelcome").hide();
        $(".navbar").hide();
        $(".wrapper").show();

    })
    $("#favouriteRestaurants").on("click", function() {
        console.log("Favourite Restaurants");
        //$("#resPanel").hide();
        $("#leftRestaurantSection").empty();
        console.log(customerObject.restaurants);



        var domainRestaurantObject = {}
        var domainRestaurantList = {
            "restaurants": []
        }

        $.each(customerObject.restaurants, function(index, value) {

            domainRestaurantObject = new Object();
            domainRestaurantObject.restaurant = new Object();
            domainRestaurantObject.restaurant.id = value.restaurantId;
            domainRestaurantObject.restaurant.name = value.restaurantName;
            domainRestaurantObject.restaurant.thumb = value.image;
            domainRestaurantObject.restaurant.location = {};
            domainRestaurantObject.restaurant.location.latitude = value.location.latitude;
            domainRestaurantObject.restaurant.location.longitude = value.location.longitude;
            domainRestaurantObject.restaurant.location.address = value.location.address,
                domainRestaurantObject.restaurant.user_rating = new Object();
            domainRestaurantObject.restaurant.user_rating.aggregate_rating = value.userRating;
            domainRestaurantObject.restaurant.cuisines = value.cuisines;
            domainRestaurantList.restaurants.push(domainRestaurantObject);

        });


        //domainRestaurantObject.restaurant= domainRestaurantObject;
        buildRestaurantPanel(domainRestaurantList, "removeRestaurant");

    })

    $("#restaurantPanel").on("click", ".restaurantRemove", function() {
        console.log($(this).attr("data-restaurantId"));
        console.log(customerObject.restaurants);
        var deleteRestaurantId = $(this).attr("data-restaurantId");
        var restaurantId = $(this).attr("data-restaurantId");
        var tempArray = [];

        customerObject.restaurants = $.grep(customerObject.restaurants, function(item, value) {

            return item.restaurantId != deleteRestaurantId;
        });


        database.ref("/" + customerKey + "/").update({

            restaurants: customerObject.restaurants

        })
        //Animate and remove the row 
        var parentRowId = $(this).attr("data-parentRow");

        $("." + parentRowId).fadeOut(500, function() {});
    });


    $("#restaurantPanel").on("click", ".menuItemDisplay", function() {

        $(".modal-title").text($(this).attr("data-restaurantName"));

        //Empty Flipbook Div
        restaurantName = $(this).attr("data-restaurantName");
        console.log(restaurantName);

        //Call Restaurant API to get the menu item
        var restaurantId = 16507679;

        $.ajax({
            beforeSend: function(request) {
                request.setRequestHeader("user-key", authorizationToken);
                openModal();
            },


            url: "https://developers.zomato.com/api/v2.1/dailymenu?res_id=" + restaurantId,
            dataType: 'json',
            success: function(response) {

                $.each(response["daily_menus"], function(index, value) {

                    var tableHolder = 0;
                    pageCounter = 0;
                    var restaurantMenu = $("<div> </div>").attr("id", "tableHolder" + tableHolder);
                    $(restaurantMenu).appendTo("#restaurantMenu");

                    $("#menuCover").html(restaurantName + " - Enjoy and Love Food!")

                    var table = $('<table> <tr><th>Item Id</th><th>Menu Item</th> <th>Price</th></tr></table>').addClass('restaurantMenuTable');
                    $(table).appendTo("#tableHolder" + tableHolder);

                    for (var menuCounter = 0; menuCounter < value["daily_menu"].dishes.length; menuCounter++) {

                        console.log("Menu Counter" + menuCounter);
                        console.log($(table));
                        var rowMenu = $('<tr></tr>');

                        var dishColumn = $('<td></td>').text(value["daily_menu"].dishes[menuCounter]["dish"].dish_id).appendTo(rowMenu);
                        var nameColumn = $('<td></td>').text(value["daily_menu"].dishes[menuCounter]["dish"].name).appendTo(rowMenu);
                        var priceColumn = $('<td></td>').text(value["daily_menu"].dishes[menuCounter]["dish"].price).appendTo(rowMenu);
                        $(rowMenu.appendTo(table));

                        if (pageDisplayCounter == 2) {
                            console.log("*****Append Table Here****");


                            console.log($(table));
                            console.log("TableHolder Count " + tableHolder);
                            pageDisplayCounter = 0;
                            tableHolder++;
                            pageCounter++;
                            restaurantMenu = $("<div> </div>").attr("id", "tableHolder" + tableHolder);
                            $(restaurantMenu).appendTo("#restaurantMenu");
                            table = $('<table></table>').addClass('restaurantMenuTable').appendTo("#tableHolder" + tableHolder);

                        } else {
                            pageDisplayCounter++;
                        }


                    }


                })

                closeModal();
                debugger;
                console.log("PageCounter Value " + pageCounter);

                for (var i = 0; i < pageCounter; i++) {

                    domtoimage.toJpeg(document.getElementById("tableHolder" + i), {
                            quality: 0.95
                        })
                        .then(function(dataUrl) {


                            var image = $("<img>");
                            $(image).attr("src", dataUrl);

                            var flipBookPage = $("<div> </div>").prepend(image);


                            $('#flipbook').turn('addPage', flipBookPage, flipBookPageDisplay);
                            flipBookPageDisplay++;

                        });

                }
                $('#restaurantMenu').css('opacity', '0.0');

            }
        });


    });


})
$("#flipbook").turn({
    width: 800,
    height: 400,
    autoCenter: true
});