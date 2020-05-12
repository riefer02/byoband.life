import axios from 'axios';

export const resetPassword = async (password, passwordConfirm, token) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: 'http://localhost:6969/users/reset-password/:token',
			data: {
				password,
				passwordConfirm,
				token,
			},
		});

		console.log(res);
	} catch (err) {
		console.log(err.response.data);
	}
};
