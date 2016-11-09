var pidlog = "";

function get(config)
{
	var component = {};

	var appname = config.appname ? config.appname : "api";
	var verbose = config.verbose ? config.verbose : false;
	var applog = "A[" + appname + "] ";


	var logEvent = function(event)
	{
		var now = new Date().toISOString().replace(/T/, ',').replace(/\..+/, '');
		var log_message = "[" + now + "] " + event;

		console.log(log_message);
	}

	var logInfo = function(event) { logEvent(pidlog + applog + "INFO: " + event); }

	var logError = function(event) { logEvent(pidlog + applog + "ERROR: " + event); }

	var logInfoVerbose = function(event) { if(verbose) logInfo(event); }

	var logErrorVerbose = function(event) { if(verbose) logError(event); }

	var setVerbose = function(vb) { verbose = vb; }

	var setPID = function(pid) { pidlog = "W[" + pid + "] "; }

	component.info = logInfo;
	component.error = logError;
	component.info_v = logInfoVerbose;
	component.error_v = logErrorVerbose;
	component.verbose = setVerbose;
	component.pid = setPID;

	return component;
}

module.exports.get = get;
