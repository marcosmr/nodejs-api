function init(app)
{
	var route = "/role/services";

	var router = app.router;
	var logger = app.logger;
	var errors = app.errors;
	var values = app.values;
	var auth = app.auth;
	var form = app.form;

	var role = app.roles.admin.admin;


	var auth_service = function(req, res, user)
	{
		var response = {};
		res.send(response);
	}

	var no_auth_service = function(req, res)
	{
		var response = {};
		res.send(response);
	}

	router.get(route + "/auth", auth.endpoint(role, auth_service));
	router.get(route + "/noauth", no_auth_service);
}

module.exports = init;
