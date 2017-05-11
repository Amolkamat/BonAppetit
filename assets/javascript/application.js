var authorizationToken = "d7fda2a55ab194aa43164678b555e918";

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
                url: "https://developers.zomato.com/api/v2.1/search?lat=" + results[0].geometry.location.lat() + "&lon=" + results[0].geometry.location.lng(),
                dataType: 'json',
                success: function(response) {
                    closeModal();
                    $("#resPanel").show();
                    var searchContentDiv = $("<div class='searchResultsContent'>");
                    $("#leftRestaurantSection").empty();

                    console.log(response["restaurants"]);
                    var restaurantCounter = 0;
                    $.each(response["restaurants"], function(index, value) {

                        var searchResultItem = $("<div class='row' >");
                        var imageColumnDiv = $("<div class='col-md-3' >");
                        $(imageColumnDiv).appendTo(searchResultItem);
                        var foodImage = "";

                        if (value["restaurant"].thumb == "") {
                            foodImage = "./assets/images/veggie.jpg"
                        } else {
                            foodImage = value["restaurant"].thumb;
                        }
                        restaurantCounter++;

                        var restaurantName = $("<h4>" + restaurantCounter + ". " + value["restaurant"].name + "</h4>");
                        var detailsColumnDiv = $("<div class='col-md-3' >");
                        $(detailsColumnDiv).appendTo(searchResultItem);
                        $(restaurantName).appendTo(detailsColumnDiv);

                        var ratingClass = "rating" + restaurantCounter;

                        var ratingDiv = $("<div id= " + ratingClass + ">");
                        $(ratingDiv).appendTo(detailsColumnDiv);

                        
                        var ratingValue = value["restaurant"].user_rating.aggregate_rating;
                        var roundedValue = Math.trunc(ratingValue);
                        var selector =  "#" + ratingClass;
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

                        var addressColumnDiv = $("<div class='col-md-3' >");

                        var addressArray = value["restaurant"].location.address.split(',');;
                        $.each(addressArray, function( index, value ) {
                               var addressLine = $("<h5 id='addressLines' > " + value + "</h5>").appendTo(addressColumnDiv); 

                            });
                        
                        $(addressColumnDiv).appendTo(searchResultItem);

                        var cusineList = $("<h6> <b> Cuisines: </b> " + value["restaurant"].cuisines + "</h6>");
                        $(cusineList).appendTo(detailsColumnDiv);
                        var $restaurantImage = $("<img class='img-responsive'>")
                            .attr({
                                "src": foodImage

                            })

                        $($restaurantImage).appendTo(imageColumnDiv);




                        //$(gifDiv.appendTo("#giphyPanel"));
                        $(searchResultItem.appendTo("#leftRestaurantSection"));

                    });



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

$(document).ready(function() {

    $("#resPanel").hide();

})