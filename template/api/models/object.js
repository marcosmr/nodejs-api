function init(app)
{
	var db = app.database.db;
	var ObjectId = db.Schema.Types.ObjectId;

	var model = "Object";
	var schema =
	{
		is_active: {type:Boolean, default:true},
		created_at: {type:Date, default:Date.now}
	}

	return db.model(model, new db.Schema(schema));
}

module.exports = init;
