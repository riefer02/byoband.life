import axios from 'axios';

export const resetPassword = async (password, passwordConfirm, token) => {
	try {
		// console.log('inside resetPassword.js');
		const url = window.location.origin;
		const res = await axios({
			method: 'PATCH',
			url: `${url}/users/reset-password/:token`,
			data: {
				password,
				passwordConfirm,
				token,
			},
		}).then((res) => {
			// console.log(res);
			// console.log(res.data.redirect);
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
