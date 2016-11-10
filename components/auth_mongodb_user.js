function get(config, database, errors, logger)
{
	var component = {};

	var secret = config.secret;


	if(!secret)
	{
		logger.error("mongodb user secret not found");
		process.exit(1);
	}


	var jwt = require('jwt-simple');
	var crypto = require('crypto');
	var base64url = require('base64url');

	var model = require('./auth_mongodb_user_model').get(database);
	var controller = require('./auth_mongodb_user_controller').get(model, errors, logger);


	var getToken = function(headers)
	{
		if(headers && headers.authorization)
		{
			var parted = headers.authorization.split(' ');
			var token = (parted.length === 2 ? parted[1] : null);
			return token;
		}

		return null;
	}

	var createToken = function(user)
	{
		return jwt.encode(user, secret);
	}

	var createValidationToken = function()
	{
		return base64url(crypto.randomBytes(32));
	}

	var validateRole = function(roles, role, res)
	{
		if(!roles[role])
		{
			errors(res, 'role_not_found');
			return null;
		}

		return role;
	}

	var authEndpoint = function(roles, endpoint)
	{
		var authorize = function(req, res)
		{
			var token = getToken(req.headers);

			if(!token)
			{
				errors(res, 'token_missing');
				return;
			}

			var params = {};
			try
			{
				var data = jwt.decode(token, secret);
				params.user_id = data._id;
				params.roles = (typeof roles == "object") ? roles : [roles];
			}
			catch(e)
			{
				errors(res, 'token_invalid');
				return;
			}

			model.authorize(params, res, function(user)
			{
				endpoint(req, res, user);
			});
		}

		return authorize;
	}

	component.model = model;
	component.controller = controller;
	component.token = createToken;
	component.validation = createValidationToken;
	component.role = validateRole;
	component.endpoint = authEndpoint;

	return component;
}

module.exports.get = get;
