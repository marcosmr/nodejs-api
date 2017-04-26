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

	var newObject = function(Model, data, res, callback, callback_error)
	{
		var object = new Model(data);
		object.save(function(error)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'object_not_created');
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

	var findObject = function(Model, query, res, callback, callback_error)
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
				if(callback_error) callback_error(error);
				else errors(res, 'database_error');
				return;
			}

			if(!query.nullable)
			{
				if(!object)
				{
					if(callback_error) callback_error();
					else errors(res, 'object_not_found');
					return;
				}

				if(!query.inactive)
				{
					if(!object.is_active)
					{
						if(callback_error) callback_error();
						else errors(res, 'object_not_found');
						return;
					}
				}
			}

			callback(object);
		});
	}

	var findCollection = function(Model, query, res, callback, callback_error)
	{
		var params = query.params;
		if(params.is_active == undefined) params.is_active = true;

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
				if(callback_error) callback_error(error);
				else errors(res, 'database_error');
				return;
			}

			if(!collection)
			{
				if(callback_error) callback_error();
				else errors(res, 'object_not_found');
				return;
			}

			callback(collection);
		});
	}

	var updateObject = function(object, res, callback, callback_error)
	{
		object.save(function(error)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'object_not_saved');
				return;
			}

			callback(object);
		});
	}

	var updateCollection = function(Model, query, res, callback, callback_error)
	{
		var options = {multi:true};

		Model.update(query.params, query.update, options, function(error, num)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'database_error');
				return;
			}

			callback(num);
		});
	}

	var countCollection = function(Model, query, res, callback, callback_error)
	{
		Model.count(query.params, function(error, count)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'database_error');
				return;
			}

			callback(count);
		});
	}

	var aggregateCollection = function(Model, query, res, callback, callback_error)
	{
		Model.aggregate(query.aggregation, function(error, collection)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'database_error');
				return;
			}

			if(query.population)
			{
				Model.populate(collection, query.population, function(error, collection)
				{
					if(error)
					{
						logger.error(error);
						if(callback_error) callback_error(error);
						else errors(res, 'database_error');
						return;
					}

					callback(collection);
				});
			}
			else
			{
				callback(collection);
			}
		});
	}

	var deleteObject = function(object, res, callback, callback_error)
	{
		object.remove(function(error)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'object_not_deleted');
				return;
			}

			callback(object);
		});
	}

	var deleteCollection = function(Model, query, res, callback, callback_error)
	{
		Model.remove(query.params, function(error)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'database_error');
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
	component.countCollection = countCollection;
	component.aggregateCollection = aggregateCollection;
	component.deleteObject = deleteObject;
	component.deleteCollection = deleteCollection;

	return component;
}

module.exports.get = get;
