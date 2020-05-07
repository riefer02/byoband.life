const http = require('http');

module.exports = () => {
	setInterval(function () {
		var options = {
			host: 'www.byoband.life',
			port: process.env.PORT || 6969,
			path: '/',
		};
		http
			.get(options, function (res) {
				res.on('data', function (chunk) {
					try {
						console.log('HEROKU Response: ' + chunk);
					} catch (err) {
						console.log(err.message);
					}
				});
			})
			.on('error', function (err) {
				console.log('Error: ' + err.message);
			});
	}, 20 * 60 * 1000);
};
