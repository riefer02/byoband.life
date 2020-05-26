import { resetPassword } from './passwordReset';
import { increaseRating } from './increaseRating';

const likePost = (event) => {
	// UPDATES RATING VALUE ON THE FRONT END

	// SENDS TO EXPRESS ROUTE TO UPDATE RATING IN DATABASE

	// EVENT DELEGATION
	let postID = event.target.parentNode.parentNode.parentNode.id;
	if (postID) {
		const increaseValue = (postID) => {
			let ratingValue = parseInt(
				document.getElementById(`${postID}--rating`).innerHTML
			);
			console.log(ratingValue);
			ratingValue += 1;
			document.getElementById(`${postID}--rating`).innerHTML = ratingValue;
		};
		increaseValue(postID);
		increaseRating(postID);
	}
};

// Increase Posts Rating EVENT HANDLER --> DEV
document
	.querySelector('.event-delegation-1')
	.addEventListener('click', likePost);

if (document.querySelector('#password-reset-form')) {
	// Password Reset EVENT HANDLER: Client Side Functionality
	document
		.querySelector('#password-reset-form')
		.addEventListener('submit', (e) => {
			e.preventDefault();
			const password = document.getElementById('password').value;
			const passwordConfirm = document.getElementById('passwordConfirm').value;
			const token = window.location.href.split('/');
			console.log(password, passwordConfirm, token[4]);
			resetPassword(password, passwordConfirm, token[4]);
		});
} else {
	console.log('meow');
}
