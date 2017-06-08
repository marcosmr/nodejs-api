function get(app, errors, logger)
{
	var component = {};

	var http = require('http');
	var https = require('https');


	var get = function(params, res, callback, callback_error)
	{
		var data = params.data;

		if(data && data != null)
		{
			var values = "";
			for(var v in data)
			{
				values += (values.length == 0 ? "?" : "&") + v + "=" + data[v];
			}
			params.path += values;
		}

		var options =
		{
			method: "GET",
			headers: params.headers,
			host: params.host,
			path: params.path,
			secure: params.secure,
			json: params.json
		};

		sendRequest(options, res, callback, callback_error);
	}

	var post = function(params, res, callback, callback_error)
	{
		var options =
		{
			method: "POST",
			headers: params.headers,
			host: params.host,
			path: params.path,
			secure: params.secure,
			json: params.json,
			data: params.data
		};

		sendRequest(options, res, callback, callback_error);
	}

	var sendRequest = function(params, res, callback, callback_error)
	{
		var headers = params.headers ? params.headers : {};
		if(params.json) headers["Content-Type"] = "application/json";

		var options =
		{
			host: params.host,
			path: params.path,
			method: params.method,
			headers: headers
		};

		var requester = params.secure ? https : http;
		var request = requester.request(options, function(response)
		{
			var content = "";
			response.setEncoding('utf8');
			response.on('data', function(part){ content += part; });
			response.on('error', function(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'request_error')
			});
			response.on('end', function()
			{
				callback(content);
			});
		});

		if(params.data)
		{
			var data = params.json ? JSON.stringify(params.data) : params.data;
			request.write(data);
		}
		request.end();
	}

	component.get = get;
	component.post = post;

	return component;
}

module.exports.get = get;
