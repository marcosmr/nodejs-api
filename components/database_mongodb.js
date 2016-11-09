function get(config, errors, logger)
{
	var component = {};

	var server = config.server;
	var ssl = config.ssl;


	if(!server)
	{
		logger.error("mongodb server not found");
		process.exit(1);
	}

	if(ssl && ssl.enabled)
	{
		server += "?ssl=true";
		if(ssl.local) server += "&sslValidate=false"
	}

	var mongoose = require('mongoose');
	mongoose.Promise = require('bluebird');


	var connectDatabase = function()
	{
		mongoose.connect(server, function(error)
		{
			if(error)
			{
				logger.error("database not available");
				logger.error(error);
				process.exit(1);
			}

			logger.info("database mongodb connected");
		});
	}

	var newObject = function(Model, data, res, callback)
	{
		var object = new Model(data);
		object.save(function(error)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'object_not_created');
				return;
			}

			callback(object);
		});
	}

	var existsObject = function(Model, query, callback)
	{
		var search = query.id ? Model.findById(query.id) : Model.findOne(query.params);

		search.exec(function(error, object)
		{
			callback(!(error || !object));
		});
	}

	var findObject = function(Model, query, res, callback)
	{
		var search = query.id ? Model.findById(query.id) : Model.findOne(query.params);
		if(query.selection) search = search.select(query.selection);
		if(query.population) search = search.populate(query.population);
		if(query.sort) search = search.sort(query.sort);
		if(query.limit) search = search.limit(query.limit);

		search.exec(function(error, object)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			if(!query.nullable)
			{
				if(!object || !object.is_active)
				{
					errors(res, 'object_not_found');
					return;
				}
			}

			callback(object);
		});
	}

	var findCollection = function(Model, query, res, callback)
	{
		var params = query.params;
		params.is_active = true;

		var search = Model.find(params);
		if(query.selection) search = search.select(query.selection);
		if(query.population) search = search.populate(query.population);
		if(query.sort) search = search.sort(query.sort);
		if(query.limit) search = search.limit(query.limit);

		search.exec(function(error, collection)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			if(!collection)
			{
				errors(res, 'object_not_found');
				return;
			}

			callback(collection);
		});
	}

	var updateObject = function(object, res, callback)
	{
		object.save(function(error)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'object_not_saved');
				return;
			}

			callback(object);
		});
	}

	var updateCollection = function(Model, query, res, callback)
	{
		var options = {multi:true};

		Model.update(query.params, query.update, options, function(error, num)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			callback(num);
		});
	}

	var deleteObject = function(object, res, callback)
	{
		object.remove(function(error)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'object_not_deleted');
				return;
			}

			callback(object);
		});
	}

	var deleteCollection = function(Model, query, res, callback)
	{
		Model.remove(query.params, function(error)
		{
			if(error)
			{
				logger.error(error);
				errors(res, 'database_error');
				return;
			}

			callback();
		});
	}

	component.db = mongoose;
	component.connect = connectDatabase;
	component.newObject = newObject;
	component.existsObject = existsObject;
	component.findObject = findObject;
	component.findCollection = findCollection;
	component.updateObject = updateObject;
	component.updateCollection = updateCollection;
	component.deleteObject = deleteObject;
	component.deleteCollection = deleteCollection;

	return component;
}

module.exports.get = get;
