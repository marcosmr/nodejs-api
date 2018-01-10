function get(config, errors, logger)
{
	var component = {};

	var apikey = config.apikey;
	var accountId = config.accountId;
	var isProduction = config.production;


	if(!apikey)
	{
		logger.error("openpay api key not found");
		process.exit(1);
	}

	if(!accountId)
	{
		logger.error("openpay account id not found");
		process.exit(1);
	}

	//class
	var Openpay = require('openpay');
	//instantiation
	var openpay = new Openpay(accountId, apikey);


	if(isProduction){
		openpay.setProductionReady(true);
	}



	var createAccount = function(params, res, callback, callback_error)
	{
		var customerRequest =
		{
			requires_account: false,
			name: params.name,
			email: params.email
		};

		if(params.lastname) {
			customerRequest.lastname = params.lastname;
		}

		openpay.customers.create(customerRequest, function(error, customer) {
		  if(error) {
		  	callback_error(error);
		  } else {
		  	callback(customer);
		  }
		});
	}

	var saveCard = function (params, res, callback, callback_error){

		var cardRequest = {
			'token_id': params.token_id,
			'device_session_id': params.device_session_id,
		}
		console.log(cardRequest);
		openpay.customers.cards.create(params.clienteid, cardRequest, function (error, card) {
			if (error) {
				var response = {'error': error};
				res.send(response);
			}

			var response = {'card': card};
			res.send(response);

		});
	}



	component.createAccount = createAccount;
	component.saveCard = saveCard;

	return component;
}

module.exports.get = get;
