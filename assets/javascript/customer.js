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
		{
			type: "",
			restaurantId:"",
			restaurantName:"",
			userRating:"",
			"location" : {
				latitude:"",
				longitude:""
			}
		}

	]
}

$(document).ready(function() {


	console.log("Customer " + JSON.stringify(customerObject));

	$("#registerSubmit").on("click",function() {

		//Validate input data and add the customer into Database
		customerObject.profile.loginId = $("#username").val();
		customerObject.profile.password = $("#email").val();
		customerObject.profile.lemailAddress = $("#password").val();


		//Push customer if all values are good - 
		//	database.ref().push(customerObject);

     openModal();
    $(".wrapper").hide();
    $("#userWelcome").show();
    $(".navbar").show();
    closeModal();
				

	})


	

})