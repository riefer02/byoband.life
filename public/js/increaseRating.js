import axios from 'axios';

export const increaseRating = async (postID) => {
	try {
		const url = window.location.origin;
		const res = await axios({
			method: 'PATCH',
			url: `${url}/posts/like-post/${postID}`,
			data: {
				postID,
			},
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Access-Control-Allow-Origin': '*',
			},
		}).then((res) => {
			console.log('successfully updated rating');
			if (res.data.redirect === '/') {
				console.log('trying to redirect...but..');
				window.location.href = '/';
			} else {
				console.log('exiting increaseRating function');
			}
		});
	} catch (err) {
		console.log(err);
	}
};
