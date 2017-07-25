var config =
{
	appname: 'api',
	serverpath: '/v1',
	lang: 'es',
	verbose: true,
	database:
	{
		component: 'mongodb',
		server: 'mongodb://user:password@localhost/database'
	},
	auth:
	{
		component: 'mongodb_user',
		secret: 'p4s5w0rD!'
	},
	email:
	{
		component: 'smtp',
		connection:
		{
			host: 'hostname',
			port: 465,
			secure: true,
			auth:
			{
				user: 'user',
				pass: 'password'
			}
		},
		from: 'Sender <email@server.com>',
		templates: '/resources/email/'
	}
};

module.exports = config;
