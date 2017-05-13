var customerKey = "";
var customerObject = 	{

	"customerId": 0,
	"profile": {
		firstName: "",
		lastName: "",
		loginId:"",
		password: "",
		emailAddress: ""
	},
	"restaurants": [	

	]
}

var customerList=[];

var customerKeyObject = {
	"key":"",
	"customerData": ""
};


$(document).ready(function() {

$("#loginButton").on("click",function(){
    
 	//Find if the username password matches.
 	console.log(customerList.length)
 	$.each(customerList, function( index, value ) {
 		console.log(value.customerData.profile.loginId)
 		
 		if (value.customerData.profile.loginId=== $("#username").val() && value.customerData.profile.password=== $("#password").val())
 		{
 			//Found Match for the correct customer
 			customerKey = value.key;
 			customerObject = value.customerData;
 			console.log(customerObject);

 			//Modify the Screen information as per the current customer

 			$("#dropDownName").text(customerObject.profile.firstName);
 			$("#customerName").text(customerObject.profile.firstName + " " + customerObject.profile.lastName);
 			$("#customerEmail").text(customerObject.profile.emailAddress);

 			$(".wrapper").hide();
    		$("#userWelcome").show();
    		$(".navbar").show();

    		//Clear contents
    		$("#username").val("");
    		$("#password").val("");	
    
 		} else {
 			console.log("Sorry invalid attempt");
 		}
	})

 	
})

	$("#registerSubmit").on("click",function() {

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
		customerList.push(dbCustomerObject);
		customerKey = snapshot.key;

		console.log("Customer Object from DB " + JSON.stringify(customerKeyObject));
		console.log(customerList);	
	});
	
	    $("#restaurantPanel").on("click",".restaurantAdd",function() {
        
	    //Get the key for Testing purposes.

        //Check if the restaurant id is not available already
        console.log($(this).attr("data-restaurantId"));	


        //Add the restaurant object to Customer Id
        var selectedRestaurant = {
        	type: "customerSelected",
			restaurantId:$(this).attr("data-restaurantId"),
			restaurantName:$(this).attr("data-restaurantName"),
			userRating:4,
			"location" : {
				latitude:$(this).attr("data-restaurantLatitude"),
				longitude:$(this).attr("data-restaurantLongitude")
        	}
        }
        
        if(customerObject.restaurants == null)
        {
        	customerObject.restaurants=[];
        }
        

        customerObject.restaurants.push(selectedRestaurant);
        	

        console.log("/"+customerKey +"/restaurants/");

        /*
        database.ref("/"+customerKey +"/").update({

        	restaurants: customerObject.restaurants
        }) */
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
            }, function () {
                $(this).detach()
            });    
        $(this).fadeOut( "slow", function() {
    // Animation complete.
  });    

    } )

	 //BootStrap validator function
	 
	//Sign Out Button - Clean up Script
	$("#signOut").on("click",function(){ 
		console.log ("Sign out customer");
	$("#resPanel").hide();

    $("#userWelcome").hide();
    $(".navbar").hide();
    $(".wrapper").show();

	})
})