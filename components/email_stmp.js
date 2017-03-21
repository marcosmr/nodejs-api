function get(config, errors, logger)
{
	var component = {};

	var connection = config.connection;
	var default_from = config.from;
	var templates = config.templates;
	var path = config.path;

	if(!connection)
	{
		logger.error("stmp connection data not found");
		process.exit(1);
	}

	if(!default_from)
	{
		logger.error("stmp default from data not found");
		process.exit(1);
	}

	if(!templates)
	{
		logger.error("stmp templates data not found");
		process.exit(1);
	}

	var fs = require('fs');
	var mailer = require('nodemailer');
	var transport = mailer.createTransport(connection);


	var sendEmail = function(params, res, callback, callback_error)
	{
		var from_data = params.from ? params.from : default_from;
		var template = path + templates + params.template + ".html";

		try
		{
			var html = fs.readFileSync(template, "utf8");
		}
		catch(error)
		{
			logger.error(error);
			if(callback_error) callback_error(error);
			else errors(res, 'mail_error');
			return;
		}

		for(val in params.values)
		{
			var exp = new RegExp("__" + val + "__", "g");
			var sub = params.values[val];

			html = html.replace(exp, sub);
		}

		var mail =
		{
			from: from_data,
			to: params.to,
			subject: params.subject,
			html: html,
			text: ""
		};

		transport.sendMail(mail, function(error, response)
		{
			transport.close();

			if(error)
			{
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
