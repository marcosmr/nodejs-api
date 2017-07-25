function init(app)
{
	var controller = {};

	var logger = app.logger;
	var errors = app.errors;

	var database = app.database;
	var model = app.models.object;


	var newObject = function(params, res, callback)
	{
		var data =
		{
		};

		database.newObject(model, data, res, callback);
	}

	var updateObject = function(object, res, callback)
	{
		database.updateObject(object, res, callback);
	}

	var findObjectById = function(id, res, callback, data)
	{
		var query = {};
		query.id = id;
		if(data) query.population = getDataPopulation(data);

		database.findObject(model, query, res, callback);
	}

	var findCollectionAll = function(params, res, callback, data)
	{
		var query = {};
		query.params = {};
		if(data) query.population = getDataPopulation(data);

		database.findCollection(model, query, res, callback);
	}

	var deleteObject = function(object, res, callback)
	{
		database.deleteObject(object, res, callback);
	}

	var getDataPopulation = function(data)
	{
		var population = [];

		return population;
	}

	controller.new = newObject;
	controller.update = updateObject;
	controller.findById = findObjectById;
	controller.findAll = findCollectionAll;
	controller.delete = deleteObject;

	return controller;
}

module.exports = init;
