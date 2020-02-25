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
		host: "fcm.googleapis.com/fcm/",
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
		if(!params.to)
		{
			if(!params.ids) return;
			if(params.ids.length == 0) return;
		}

		var data = params.data;

		var notification_data =
		{
			title: data.title,
			body: data.message,
			sound: "default"
		};
		if(params.sound) notification_data.sound = params.sound;
		if(params.badge) notification_data.badge = params.badge;

		var notification =
		{
			data: data,
			notification: notification_data,
			priority: "high",
			content_available: true
		};
		if(params.to) notification.to = params.to;
		if(params.ids) notification.registration_ids = params.ids;

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
