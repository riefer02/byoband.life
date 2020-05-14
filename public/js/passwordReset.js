import axios from 'axios';

export const resetPassword = async (password, passwordConfirm, token) => {
	console.log('testing');
	try {
		const res = await axios({
			method: 'PATCH',
			url: 'http://localhost:6969/users/reset-password/:token',
			data: {
				password,
				passwordConfirm,
				token,
			},
		}).then((res) => {
			console.log(res);
			console.log(res.data.redirect);
			if (res.data.redirect === '/') {
				console.log('trying to redirect...but..');
				window.location.href = '/';
			} else {
				console.log('what the fuck is going on?');
			}
		});
		console.log('this is the data');
	} catch (err) {
		console.log(err);
	}
};
