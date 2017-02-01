function get(model, errors, logger)
{
	var controller = {};

	var User = model;


	var authorizeUser = function(params, res, callback)
	{
		var user_id = params.user_id;

		User.findById(user_id).exec(function(error, user)
		{
			if(error)
			{
				errors(res, 'user_unauthorized');
				return;
			}

			if(!user)
			{
				errors(res, 'user_not_found');
				return;
			}

			if(!user.is_active)
			{
				errors(res, 'user_not_active');
				return;
			}

			if(params.roles.indexOf(user.role) < 0)
			{
				errors(res, 'role_unauthorized');
				return;
			}

			callback(user);
		});
	}

	var newUser = function(params, res, callback)
	{
		var query_search = [];
		query_search.push({username:params.username, role:params.role});
		query_search.push({email:params.email, role:params.role});
		var query = {$or:query_search};

		User.findOne(query).exec(function(error, user_exists)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			if(user_exists)
			{
				errors(res, 'user_already_exists');
				return;
			}

			var user = new User
			({
				username: params.username,
				email: params.email,
				password: params.password,
				role: params.role
			});

			user.save(function(error)
			{
				if(error)
				{
					logger.error(error);
					errors(res, 'user_not_created');
					return;
				}

				callback(user);
			});
		});
	}

	var updateUser = function(user, res, callback)
	{
		user.save(function(error)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'user_not_saved');
				return;
			}

			callback(user);
		});
	}

	var activateUser = function(params, res, callback)
	{
		findUserByToken(params, res, function(user)
		{
			user.is_active = true;
			user.validation_token = null;
			user.save(function(error)
			{
				if(error)
				{
					logger.error(error);
					errors(res, 'user_not_saved');
					return;
				}

				callback(user);
			});
		});
	}

	var recoverUser = function(params, res, callback)
	{
		findUserByToken(params, res, function(user)
		{
			user.password = params.password;
			user.validation_token = null;
			user.save(function(error)
			{
				if(error)
				{
					logger.error(error);
					errors(res, 'user_not_saved');
					return;
				}

				callback(user);
			});
		});
	}

	var tokenUser = function(params, res, callback)
	{
		findUserByUsername(params, res, function(user)
		{
			user.validation_token = params.token;
			user.save(function(error)
			{
				if(error)
				{
					logger.error(error);
					errors(res, 'user_not_saved');
					return;
				}

				callback(user);
			});
		});
	}

	var loginUser = function(params, res, callback)
	{
		var query_search = [];
		query_search.push({username:params.username, role:params.role});
		query_search.push({email:params.username, role:params.role});
		var query = {$or:query_search};

		User.findOne(query).exec(function(error, user)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			if(!user)
			{
				errors(res, 'user_not_found');
				return;
			}

			user.comparePassword(params.password, function(error, isMatch)
			{
				if(error)
				{
					logger.error(error);
					errors(res, 'password_wrong');
					return;
				}

				if(!isMatch)
				{
					errors(res, 'password_wrong');
					return;
				}

				callback(user);
			});
		});
	}

	var socialLoginUser = function(params, res, callback)
	{
		var query = {social_id:params.social_id, role:params.role};

		User.findOne(query).exec(function(error, user)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			if(user)
			{
				callback(user);
			}
			else
			{
				var user = new User
				({
					social_id: params.social_id,
					role: params.role
				});

				user.save(function(error)
				{
					if(error)
					{
						logger.error(error);
						errors(res, 'user_not_created');
						return;
					}

					callback(user);
				});
			}
		});
	}

	var findUserByUsername = function(params, res, callback)
	{
		var query_search = [];
		if(params.username) query_search.push({username:params.username, role:params.role});
		if(params.email) query_search.push({email:params.email, role:params.role});
		var query = {$or:query_search};

		findUser(query, res, callback);
	}

	var findUserByToken = function(params, res, callback)
	{
		var query = {validation_token:params.token, role:params.role};

		findUser(query, res, callback);
	}

	var findUser = function(query, res, callback)
	{
		User.findOne(query).exec(function(error, user)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			if(!user)
			{
				errors(res, 'user_not_found');
				return;
			}

			callback(user);
		});
	}

	var deleteUser = function(user, res, callback)
	{
		user.remove(function(error)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'user_not_deleted');
				return;
			}

			callback(user);
		});
	}

	controller.authorize = authorizeUser;
	controller.new = newUser;
	controller.update = updateUser;
	controller.activate = activateUser;
	controller.recover = recoverUser;
	controller.token = tokenUser;
	controller.login = loginUser;
	controller.social_login = socialLoginUser;
	controller.delete = deleteUser;

	return controller;
}

module.exports.get = get;
