var authorizationToken = "d7fda2a55ab194aa43164678b555e918";
var config = {
    apiKey: "AIzaSyAtzmg1dG3fWTrispYckD18L0Wnz0RAGno",
    authDomain: "bonapetite-ffb65.firebaseapp.com",
    databaseURL: "https://bonapetite-ffb65.firebaseio.com",
    projectId: "bonapetite-ffb65",
    storageBucket: "bonapetite-ffb65.appspot.com",
    messagingSenderId: "695948248134"
};

firebase.initializeApp(config);
// Create a variable to reference the database
var database = firebase.database();



$("#citySubmit").on("click", function(event) {
    $("#resPanel").hide();

    event.preventDefault();

    var cityValue = $("#city").val().trim();
    cityValue = cityValue + "us";
    //Geo Coder API
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'address': cityValue
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            //Call Zomato API to search the cuisine by City Location
            console.log("location : " + results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());


            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("user-key", authorizationToken);
                    openModal();
                },


                url: "https://developers.zomato.com/api/v2.1/search?q=" + $("#restaurantName").val() + "&lat=" + results[0].geometry.location.lat() + "&lon=" + results[0].geometry.location.lng(),
                dataType: 'json',
                success: function(response) {
                    console.log("Hotel Response" + response);

                    closeModal();
                    buildRestaurantPanel(response,"searchRestaurant");




                }
            });
        } else {
            console.log("Something got wrong " + status);
        }
    });
});

function openModal() {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('fade').style.display = 'none';
}

var buildRestaurantPanel = function(response,callOrigin) {

    $("#resPanel").show();

    //Build the DOM dynamically 

    var searchContentDiv = $("<div class='searchResultsContent'>");
    $("#leftRestaurantSection").empty();

    

    var restaurantCounter = 0;
    $.each(response["restaurants"], function(index, value) {

        var searchResultItem = $("<div class='row restaurantDisplay' >");

        //Section 1 - Adding the Restaurant Image
        var imageId = "resImage" + restaurantCounter;
        var rowId = "rowId" + restaurantCounter
        var imageColumnDiv = $("<div class='col-md-3' >");


        $(imageColumnDiv).appendTo(searchResultItem);
        var foodImage = "";
        
        console.log(value["restaurant"]);
      

        if (value["restaurant"].thumb == "") {
            foodImage = "./assets/images/foodImage" + Math.floor((Math.random() * 19) + 1) + ".jpeg";

        } else {
            foodImage = value["restaurant"].thumb;
        }
        restaurantCounter++;



        //Section 2 - Append Restaurant Name and Rating section
        var detailsColumnDiv = $("<div class='col-md-3' >");
        var restaurantName = $("<h4>" + restaurantCounter + ". " + value["restaurant"].name + "</h4>");
        $(detailsColumnDiv).appendTo(searchResultItem);
        $(restaurantName).appendTo(detailsColumnDiv);

        var ratingClass = "rating" + restaurantCounter;

        var ratingDiv = $("<div id= " + ratingClass + ">");
        $(ratingDiv).appendTo(detailsColumnDiv);


        var ratingValue = value["restaurant"].user_rating.aggregate_rating;
        var roundedValue = Math.trunc(ratingValue);
        var selector = "#" + ratingClass;
        for (var j = 0; j < roundedValue; j++) {
            $(ratingDiv).append('<i class="fa fa-star" aria-hidden="true"></i>');
        }
        var k = 0;
        if (ratingValue - roundedValue > 0.4 && ratingValue - roundedValue < 1) {
            k = 1;
            $(ratingDiv).append('<i class="fa fa-star-half-o" aria-hidden="true"></i>');
        }
        for (var i = Math.trunc(ratingValue) + k; i < 5; i++) {
            $(ratingDiv).append('<i class="fa fa-star-o" aria-hidden="true"></i>');
        }

        //Section 3 - Append Address of the restaurant
        var addressColumnDiv = $("<div class='col-md-3' >");

        var addressArray = value["restaurant"].location.address.split(',');;
        $.each(addressArray, function(index, value) {
            var addressLine = $("<h5 id='addressLines' > " + value + "</h5>").appendTo(addressColumnDiv);

        });

        $(addressColumnDiv).appendTo(searchResultItem);

        //Section 4 - Add the appropriate action buttons
        var actionButtonsColumnDiv = $("<div class='col-md-1' >");
        if(callOrigin==="removeRestaurant")
        {
            var actionButton = $("<input type='button' value='Remove' class='btn btn-link  restaurantRemove'>  </input>").appendTo(actionButtonsColumnDiv);
        }
            else

        {
            var actionButton = $("<input type='button' value='Favourite' class='btn btn-link restaurantAdd'>  </input>").appendTo(actionButtonsColumnDiv);

            var recommendButton = $("<input type='button' value='Recommended' class='btn btn-link restaurantAdd'>  </input>").appendTo(actionButtonsColumnDiv);

            var menuButton = $("<input type='button' value='Menu  ' class='btn btn-link menuItemDisplay' data-toggle='modal' data-target='#myModal' >  </input>").appendTo(actionButtonsColumnDiv);


        }
        

        $(actionButton)
            .attr({

                "data-restaurantId": value["restaurant"].id,
                "data-restaurantName": value["restaurant"].name,
                "data-restaurantLatitude": value["restaurant"].location.latitude,
                "data-restaurantLongitude": value["restaurant"].location.longitude,
                "data-imageId": imageId,
                "data-image":value["restaurant"].thumb,
                "data-cuisines":value["restaurant"].cuisines,
                "data-address": value["restaurant"].location.address,
                "data-rating":value["restaurant"].user_rating.aggregate_rating,
                "data-parentRow":rowId,
                "data-type":"0"
            })
        $(recommendButton)
            .attr({

                "data-restaurantId": value["restaurant"].id,
                "data-restaurantName": value["restaurant"].name,
                "data-restaurantLatitude": value["restaurant"].location.latitude,
                "data-restaurantLongitude": value["restaurant"].location.longitude,
                "data-imageId": imageId,
                "data-image":value["restaurant"].thumb,
                "data-cuisines":value["restaurant"].cuisines,
                "data-address": value["restaurant"].location.address,
                "data-rating":value["restaurant"].user_rating.aggregate_rating,
                "data-parentRow":rowId,
                "data-type": "1"
            })    
        if(menuButton != null) 
        {


        $(menuButton)
            .attr({

                "data-restaurantId": value["restaurant"].id,
                "data-restaurantName": value["restaurant"].name,
                "data-restaurantLatitude": value["restaurant"].location.latitude,
                "data-restaurantLongitude": value["restaurant"].location.longitude,
                "data-imageId": imageId,
                "data-image":value["restaurant"].thumb,
                "data-cuisines":value["restaurant"].cuisines,
                "data-address": value["restaurant"].location.address,
                "data-rating":value["restaurant"].user_rating.aggregate_rating,
                "data-parentRow":rowId
            })    
        }
        $(actionButtonsColumnDiv).appendTo(searchResultItem);
        $(actionButtonsColumnDiv).appendTo(searchResultItem);

        var cusineList = $("<h6> <b> Cuisines: </b> " + value["restaurant"].cuisines + "</h6>");
        $(cusineList).appendTo(detailsColumnDiv);
        var $restaurantImage = $("<img class='img-responsive'>")
            .attr({
                "src": foodImage

            })
        $($restaurantImage).attr('id', imageId);

        $($restaurantImage).appendTo(imageColumnDiv);
        $(searchResultItem).addClass(rowId);

        //$(gifDiv.appendTo("#giphyPanel"));
        $(searchResultItem.appendTo("#leftRestaurantSection"));

    });

}

$(document).ready(function() {

    $("#resPanel").hide();

    $("#userWelcome").hide();
    $(".navbar").hide();
    $("#mapPanel").hide();
    //Get all user information from the database.
    $("#accountPanel").hide();
})

$(function() {

    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

});


$('a.btn').on('click', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    $(".modal-body").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
});