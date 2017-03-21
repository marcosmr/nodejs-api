function get(config, errors, logger)
{
	var component = {};

	var apikey = config.apikey;
	var default_from = config.from;
	var templates = config.templates;


	if(!apikey)
	{
		logger.error("sendgrid api key not found");
		process.exit(1);
	}

	if(!default_from)
	{
		logger.error("sendgrid default from data not found");
		process.exit(1);
	}

	if(!templates)
	{
		logger.error("sendgrid templates data not found");
		process.exit(1);
	}

	var sendgrid = require('sendgrid')(apikey);


	var sendEmail = function(params, res, callback, callback_error)
	{
		var from_data = params.from ? params.from : default_from;

		var request = sendgrid.emptyRequest();
		request.method = "POST";
		request.path = "/v3/mail/send";
		request.body =
		{
			from: from_data,
			personalizations:
			[
				{
					to: params.to,
					substitutions: params.values
				}
			],
			content:
			[
				{
					type: "text/html",
					value: "_"
				}
			],
			substitutions: params.values,
			template_id: templates[params.template]
		};

		sendgrid.API(request, function(error, response)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'mail_error');
				return;
			}

			if(callback != null) callback(response);
		});
	}

	component.send = sendEmail;

	return component;
}

module.exports.get = get;
