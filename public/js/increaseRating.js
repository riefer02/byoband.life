import axios from 'axios';

export const increaseRating = async (postID) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: `http://localhost:6969/posts/like-post/${postID}`,
			data: {
				postID,
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
