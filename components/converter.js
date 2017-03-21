function get(app, errors, logger)
{
	var component = {};

	var json2csv = require('json2csv');


	var jsontocsv = function(params, res, callback, callback_error)
	{
		try
		{
			var result = json2csv(params);
			callback(result);
		}
		catch(error)
		{
			logger.error(error);
			if(callback_error) callback_error(error);
			else errors(res, 'conversion_error');
			return;
		}
	}

	component.jsontocsv = jsontocsv;

	return component;
}

module.exports.get = get;
