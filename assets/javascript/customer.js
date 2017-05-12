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
 	$.each(customerList, function( index, value ) {
 		console.log(value.customerData.profile.loginId)
 		
 		if (value.customerData.profile.loginId=== $("#username").val() && value.customerData.profile.password=== $("#password").val())
 		{
 			//Found Match for the correct customer
 			customerKey = value.key;
 			customerObject = value.customerData;
 			console.log(customerObject);

 			$(".wrapper").hide();
    		$("#userWelcome").show();
    		$(".navbar").show();

    
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
		debugger;
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
				
		customerKeyObject.key = snapshot.key;
		customerKeyObject.customerData = snapshot.val();
		customerList.push(customerKeyObject);
		customerKey = snapshot.key;

		console.log("Customer Object from DB " + JSON.stringify(customerKeyObject));
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
        customerObject.restaurants.push(selectedRestaurant);
        	

        console.log("/"+customerKey +"/restaurants/");

        database.ref("/"+customerKey +"/").update({

        	restaurants: customerObject.restaurants
        })
        
    } )

	 //BootStrap validator function
	 
	//Sign Out Button - Clean up Script
	
})