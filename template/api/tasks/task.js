function init(app)
{
	var logger = app.logger;
	var values = app.values;
	var cron = app.cron;
	var interval = "0 0 0 * * *";


	var runTask = function()
	{

	}

	cron.schedule(interval, runTask);
}

module.exports = init;
