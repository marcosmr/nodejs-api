function get(config, errors, logger)
{
	var component = {};

	var apikey = config.apikey;


	if(!apikey)
	{
		logger.error("gcm api key not found");
		process.exit(1);
	}

	var https = require('https');
	var options =
	{
		host: "gcm-http.googleapis.com",
		path: "/gcm/send",
		method: "POST",
		headers:
		{
			"Content-Type": "application/json",
			"Authorization": apikey
		}
	};


	var sendNotification = function(params, callback)
	{
		var data = params.data;

		var notification =
		{
			to: params.to,
			data: data,
			notification:
			{
				title: data.title,
				body: data.message,
				sound: "default",
				badge: "1"
			},
			priority: "high",
			content_available: true
		};

		var request = https.request(options, function(response)
		{
			var content = "";
			response.setEncoding("utf-8");
			response.on("data", function(part){ content += part; });
			response.on("error", function(error){ logger.error(error); });
			response.on("end", function()
			{
				var response = JSON.parse(content);
				if(response.failure == 1) logger.error(response.results[0].error);
				callback(response);
			});
		});
		request.write(JSON.stringify(notification));
		request.end();
	}

	component.send = sendNotification;

	return component;
}

module.exports.get = get;
