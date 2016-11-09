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


	var createAccount = function(params, res, callback)
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

		sendRequest(options, res, function(data)
		{
			callback(data);
		});
	}

	var updateAccount = function(params, res, callback)
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

		sendRequest(options, res, function(data)
		{
			callback(data);
		});
	}

	var pay = function(params, res, callback)
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

		sendRequest(options, res, function(content)
		{
			callback(content);
		});
	}

	var sendRequest = function(params, res, callback)
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
			response.on('error', function(error){ logger.error(error); errors(res, 'internal_error') });
			response.on('end', function()
			{
				var response = JSON.parse(content);

				if(response.object == "error")
				{
					logger.error(response.message);
					if(response.type == "resource_not_found_error") errors(res, 'not_found');
					else errors(res, 'internal_error');
					return;
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
