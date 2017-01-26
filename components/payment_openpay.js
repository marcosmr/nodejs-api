function get(config, errors, logger)
{
	var component = {};

	var apikey = config.apikey;
	var accountId = config.accountId;


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

	var key = new Buffer(config.apikey).toString('base64');

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
				email: email
			}
		};

		sendRequest(options, res, function(data)
		{
			callback(data);
		});
	}

	var sendRequest = function(params, res, callback)
	{
		var options =
		{
			host: 'api.openpay.mx',
			path: '/v1/' + accountId + params.path,
			method: params.method,
			headers:
			{
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': 'Basic ' + key
			}
		};

		var request = https.request(options, function(response)
		{
			var content = "";
			response.setEncoding('utf8');
			response.on('data', function(part){ content += part; });
			response.on('error', function(error){ logger.error(error); errors(res, 'payment_error') });
			response.on('end', function()
			{
				var response = JSON.parse(content);
				callback(response);
			});
		});

		request.write(JSON.stringify(params.data));
		request.end();
	}

	component.createAccount = createAccount;

	return component;
}

module.exports.get = get;
