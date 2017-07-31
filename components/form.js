function get(app, errors, logger)
{
	var component = {};


	var getParams = function(req, res, required, optional)
	{
		var params;
		if(req.query != null) params = req.query;
		if(req.body != null) params = req.body;

		if(params == null)
		{
			errors(res, 'params_required');
			return null;
		}

		var values = {};

		for(k in required)
		{
			var key = required[k];
			if(typeof params[key] == "undefined" || params[key] == null)
			{
				errors(res, 'params_required');
				return null;
			}
			values[key] = params[key];
		}

		if(optional)
		{
			for(k in optional)
			{
				var key = optional[k];
				if(!(typeof params[key] == "undefined" || params[key] == null))
				{
					values[key] = params[key];
				}
			}
		}

		return values;
	}

	var checkNumber = function(res, params, field)
	{
		var value = params[field];

		if(isNaN(value))
		{
			errors(res, 'param_format_incorrect', null, {':field': field});
			return false;
		}

		return true;
	}

	var checkArray = function(res, params, field)
	{
		var value = params[field];

		if(!(value instanceof Array))
		{
			errors(res, 'param_format_incorrect', null, {':field': field});
			return false;
		}

		if(value.length <= 0)
		{
			errors(res, 'param_missing', null, {':field': field});
			return false;
		}

		return true;
	}

	component.params = getParams;
	component.number = checkNumber;
	component.array = checkArray;

	return component;
}

module.exports.get = get;
