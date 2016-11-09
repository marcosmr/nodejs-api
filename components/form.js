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

	component.params = getParams;

	return component;
}

module.exports.get = get;
