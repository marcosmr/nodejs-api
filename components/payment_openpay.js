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
	var openpay = new Openpay( apikey, accountId);


	if(isProduction){
		openpay.setProductionReady(true);
	}

	

	var createAccount = function(params, res, callback, callback_error)
	{
		var name = params.name;
		var email = params.email;
		var token = params.token;

		var options =
		{
			path: '/customers',
			method: 'POST',
			data:
			{
				name: name,
				email: email
			}
		};

		sendRequest(options, res, callback, callback_error);
	}



	component.createAccount = createAccount;

	return component;
}

module.exports.get = get;
