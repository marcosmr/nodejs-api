function get(config, errors, logger)
{
	var component = {};

	var apikey = config.apikey;


	if(!apikey)
	{
		logger.error("conekta api key not found");
		process.exit(1);
	}

	var key = new Buffer(apikey).toString('base64');

	var https = require('https');


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
				email: email,
				cards: [token]
			}
		};

		sendRequest(options, res, callback, callback_error);
	}

	var updateAccount = function(params, res, callback, callback_error)
	{
		var conekta = params.conekta;
		var card = params.card;
		var token = params.token;

		var options =
		{
			path: '/customers/' + conekta + '/cards/' + card,
			method: 'PUT',
			data:
			{
				token: token
			}
		}

		sendRequest(options, res, callback, callback_error);
	}

	var pay = function(params, res, callback, callback_error)
	{
		var card = params.card;
		var total = params.total;
		var currency = params.currency;
		var description = params.description;
		var name = params.name;
		var email = params.email;
		var phone = params.phone;
		var items = params.items;

		var options =
		{
			path: '/charges',
			method: 'POST',
			data:
			{
				card: card,
				amount: total,
				currency: currency,
				description: description,
				details:
				{
					name: name,
					email: email,
					phone: phone,
					line_items: items
				}
			}
		}

		sendRequest(options, res, callback, callback_error);
	}

	var sendRequest = function(params, res, callback, callback_error)
	{
		var options =
		{
			host: 'api.conekta.io',
			path: params.path,
			method: params.method,
			headers:
			{
				'Content-Type': 'application/json;charset=utf-8',
				'Accept' : 'application/vnd.conekta-v1.0.0+json',
				'Authorization': 'Basic ' + key
			}
		};

		var request = https.request(options, function(response)
		{
			var content = "";
			response.setEncoding('utf8');
			response.on('data', function(part){ content += part; });
			response.on('error', function(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'payment_error')
			});
			response.on('end', function()
			{
				var response = JSON.parse(content);

				if(response.object == "error")
				{
					logger.error(response.message);
					if(callback_error) callback_error(response);
					else
					{
						if(response.type == "resource_not_found_error") errors(res, 'payment_not_found');
						else if(response.code)
						{
							if(response.code == "card_declined") errors(res, 'payment_card_declined');
							else if(response.code == "expired_card") errors(res, 'payment_expired_card');
							else if(response.code == "insufficient_funds") errors(res, 'payment_insufficient_funds');
							else if(response.code == "suspected_fraud") errors(res, 'payment_suspected_fraud');
							else if(response.code == "invalid_number") errors(res, 'payment_invalid_number');
							else if(response.code == "invalid_expiry_month") errors(res, 'payment_invalid_expiry_month');
							else if(response.code == "invalid_expiry_year") errors(res, 'payment_invalid_expiry_year');
							else if(response.code == "invalid_cvc") errors(res, 'payment_invalid_cvc');
							else if(response.code == "invalid_amount") errors(res, 'payment_invalid_amount');
							else if(response.code == "invalid_payment_type") errors(res, 'payment_invalid_payment_type');
							else if(response.code == "unsupported_currency") errors(res, 'payment_unsupported_currency');
							else if(response.code == "missing_description") errors(res, 'payment_missing_description');
							else if(response.code == "processing_error") errors(res, 'payment_processing_error');
							else errors(res, 'payment_error');
						}
						else errors(res, 'payment_error');
						return;
					}
				}

				callback(response);
			});
		});

		request.write(JSON.stringify(params.data));
		request.end();
	}

	component.createAccount = createAccount;
	component.updateAccount = updateAccount;
	component.pay = pay;

	return component;
}

module.exports.get = get;
