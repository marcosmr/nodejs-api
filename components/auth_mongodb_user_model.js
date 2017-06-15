function get(database)
{
	var db = database.db;
	var ObjectId = db.Schema.Types.ObjectId;
	var bcrypt = require('bcrypt');

	var model = "User";
	var schema =
	{
		username: {type:String},
		email: {type:String},
		password: {type:String},
		social_id: {type:String},
		role: {type:String},
		validation_token: {type:String},
		is_active: {type:Boolean, default:true},
		created_at: {type:Date, default:Date.now},
		modified_at: {type:Date}
	};

	var User = new db.Schema(schema);

	User.pre('save', function(next)
	{
		var user = this;
		user.modified_at = Date.now();

		if( this.isNew || this.isModified('password') )
		{
			if(user.password)
			{
				bcrypt.genSalt(10, function(error, salt)
				{
					if(error) return next(error);

					bcrypt.hash(user.password, salt, function(error, hash)
					{
						if(error) return next(error);

						user.password = hash;
						next();
					});
				});
			}
			else
			{
				return next();
			}
		}
		else
		{
			return next();
		}
	});

	User.methods.comparePassword = function(password, callback)
	{
		bcrypt.compare(password, this.password, function(error, isMatch)
		{
			if(error) return callback(error);

			callback(null, isMatch);
		});
	};

	return db.model(model, User);
}

module.exports.get = get;
