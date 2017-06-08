function get(app, errors, logger)
{
	var component = {};

	var request = require('request');


	var get = function(url, method, headers, data, callback, callback_error)
	{
		if(data && data != null)
		{
			var params = "";
			for(var v in data)
			{
				params += (params.length == 0 ? "?" : "&") + v + "=" + data[v];
			}
			url += params;
		}

		var options =
		{
			url: url,
			method: "GET",
			headers: headers
		};

		call(options, callback, callback_error);
	};

	var post = function(url, headers, data, callback, callback_error)
	{
		var options =
		{
			url: url,
			method: "POST",
			headers: headers,
			form: data
		};

		call(options, callback, callback_error);
	};

	var call = function(options, callback, callback_error)
	{
		request(options, function(error, response, body)
		{
			if(error)
			{
				callback_error(error);
				return;
			}

			callback(response, body);
		});
	}

	component.get = get;
	component.post = post;

	return component;
}

module.exports.get = get;
