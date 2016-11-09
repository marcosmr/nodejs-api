function init(server, path)
{
	var config = require(path + '/config');
	var content = require(path + '/content');
	var libpath = './components';

	var values = require(path + '/values');
	var liberror = require(libpath + '/error');
	var custom_errors = require(path + '/errors');
	var errors = liberror.get(config, custom_errors);
	var liblogger = require(libpath + '/logger');
	var logger = liblogger.get(config);
	var form = require(libpath + '/form');

	var app = {};
	app.path = path;
	app.secret = config.secret;
	app.roles = content.roles;
	app.values = values;
	app.errors = errors;
	app.logger = logger;
	app.logger.pid(process.pid);
	app.form = form.get(config, errors, logger);


	var modules = ['database', 'email', 'media', 'notifications', 'payment'];
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
				app.logger.info("api " + module + " = " + component);
			}
		}
	}


	if(content.models && content.models.length > 0)
	{
		logger.info("models init");

		var models = {};
		for(m in content.models)
		{
			var model = content.models[m];
			models[model] = require(path + '/models/' + model)(app);

			logger.info("model loaded: " + model);
		}

		logger.info("models loaded");

		app.models = models;
	}

	if(content.models && content.models.length > 0)
	{
		logger.info("controllers init");

		var controllers = {};
		for(c in content.models)
		{
			var controller = content.models[c];
			controllers[controller] = require(path + '/controllers/' + controller)(app);

			logger.info("controller loaded: " + controller);
		}

		logger.info("controllers loaded");

		app.controllers = controllers;
	}

	if(content.helpers && content.helpers.length > 0)
	{
		logger.info("helpers init");

		var helpers = {};
		for(h in content.helpers)
		{
			var helper = content.helpers[h];
			helpers[helper] = require(path + '/helpers/' + helper)(app);

			logger.info("helper loaded: " + helper);
		}

		logger.info("helpers loaded");

		app.helpers = helpers;
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

		var not_found_response = function(req, res)
		{
			errors(res, 'not_found');
		}

		app.router.get('*', not_found_response);
		app.router.post('*', not_found_response);
		server.use(serverpath, app.router);

		logger.info("services loaded");
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


	if(app.database) app.database.connect();
}

module.exports.init = init;
