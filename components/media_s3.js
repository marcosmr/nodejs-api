function get(config, errors, logger)
{
	var component = {};

	var aws_data = config.aws;
	var container = config.container;


	if(!aws_data)
	{
		logger.error("s3 aws data not found");
		process.exit(1);
	}

	if(!container)
	{
		logger.error("s3 container not found");
		process.exit(1);
	}

	var aws = require('aws-sdk');
	aws.config.update(aws_data);

	var s3 = new aws.S3();
	var url = "https://" + container + ".s3.amazonaws.com/";


	var uploadMedia = function(params, res, callback, callback_error)
	{
		var options =
		{
			Bucket: container,
			Key: params.filename,
			Body: params.data,
			ACL: "public-read"
		};

		s3.putObject(options, function(error, data)
		{
			if(error)
			{
				logger.error(error);
				if(callback_error) callback_error(error);
				else errors(res, 'upload_error');
				return;
			}

			callback(url + params.filename);
		});
	}

	var deleteMedia = function(params, res, callback, callback_error)
	{
		var options =
		{
			Bucket: container,
			Key: getPath(params.filename)
		}

		s3.deleteObject(options, function(error, data)
		{
			if(error)
			{
				if(callback_error) callback_error(error);
				else errors(res, 'upload_error');
				return;
			}

			callback();
		});
	}

	var getPath = function(media_url)
	{
		return media_url.replace(url, "");
	}

	component.upload = uploadMedia;
	component.delete = deleteMedia;
	component.path = getPath;

	return component;
}

module.exports.get = get;
