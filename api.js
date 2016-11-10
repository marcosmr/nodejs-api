function init(server, path)
{
	var config = require(path + '/config');
	var content = require(path + '/content');
	var libpath = './components';

	var logger = require(libpath + '/logger').get(config);
	logger.pid(process.pid);


	if(!config.database || !config.database.component)
	{
		logger.error("database configuration is required");
		process.exit(1);
	}

	if(!config.auth || !config.auth.component)
	{
		logger.error("auth configuration is required");
		process.exit(1);
	}

	if(!content.roles)
	{
		logger.error("roles data is required");
		process.exit(1);
	}


	var custom_errors = require(path + '/errors');
	var errors = require(libpath + '/error').get(config, custom_errors);
	var values = require(path + '/values');
	var roles = content.roles;

	var app = {};
	app.path = path;
	app.logger = logger;
	app.errors = errors;
	app.values = values;
	app.roles = roles;
	app.models = {};
	app.controllers = {};
	app.helpers = {};


	var database = require(libpath + '/database_' + config.database.component);
	app.database = database.get(config.database, errors, logger);
	logger.info("api database -> " + config.database.component);

	var auth = require(libpath + '/auth_' + config.auth.component);
	app.auth = auth.get(config.auth, app.database, errors, logger);
	app.models.user = app.auth.model;
	app.controllers.user = app.auth.controller;
	logger.info("api auth -> " + config.auth.component);

	var form = require(libpath + '/form');
	app.form = form.get(config, errors, logger);

	var modules = ['email', 'media', 'notifications', 'payment'];
	for(m in modules)
	{
		var module = modules[m];

		if(config[module])
		{
			var component = config[module].component;

			if(component && component.length > 0)
			{
				var lib = require(libpath + '/' + module + '_' + component);
				app[module] = lib.get(config[module], errors, logger);
				logger.info("api " + module + " -> " + component);
			}
		}
	}


	if(content.models && content.models.length > 0)
	{
		logger.info("models init");
		for(m in content.models)
		{
			var model = content.models[m];
			app.models[model] = require(path + '/models/' + model)(app);
			logger.info("model loaded: " + model);
		}
		logger.info("models loaded");

		logger.info("controllers init");
		for(c in content.models)
		{
			var controller = content.models[c];
			app.controllers[controller] = require(path + '/controllers/' + controller)(app);
			logger.info("controller loaded: " + controller);
		}
		logger.info("controllers loaded");
	}

	if(content.services && content.services.length > 0)
	{
		var serverpath = config.serverpath ? config.serverpath : '';

		var express = require('express');
		app.router = express.Router();

		logger.info("services init");
		for(s in content.services)
		{
			var service = content.services[s];
			require(path + '/services/' + service)(app);

			logger.info("service loaded: " + service);
		}
		logger.info("services loaded");

		var not_found_response = function(req, res)
		{
			errors(res, 'not_found');
		}

		app.router.get('*', not_found_response);
		app.router.post('*', not_found_response);
		server.use(serverpath, app.router);
	}

	if(content.tasks && content.tasks.length > 0)
	{
		var cron = require('node-cron');
		app.cron = cron;

		logger.info("tasks init");
		for(t in content.tasks)
		{
			var task = content.tasks[t];
			require(path + '/tasks/' + task)(app);

			logger.info("task loaded: " + task);
		}
		logger.info("tasks loaded");
	}

	if(content.helpers && content.helpers.length > 0)
	{
		logger.info("helpers init");
		for(h in content.helpers)
		{
			var helper = content.helpers[h];
			app.helpers[helper] = require(path + '/helpers/' + helper)(app);
			logger.info("helper loaded: " + helper);
		}
		logger.info("helpers loaded");
	}

	app.database.connect();
}

module.exports.init = init;
