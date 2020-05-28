import { resetPassword } from './passwordReset';
import { increaseRating } from './increaseRating';
import { purchaseTitle } from './stripe.js';

const likePost = (event) => {
	// EVENT DELEGATION
	let postID = event.target.parentNode.parentNode.parentNode.id;
	if (postID) {
		const increaseValue = (postID) => {
			let ratingValue = parseInt(
				document.getElementById(`${postID}--rating`).innerHTML
			);
			console.log(ratingValue);
			// UPDATES RATING VALUE ON THE FRONT END
			ratingValue += 1;
			document.getElementById(`${postID}--rating`).innerHTML = ratingValue;
		};
		increaseValue(postID);
		// SENDS TO EXPRESS ROUTE TO UPDATE RATING IN DATABASE
		increaseRating(postID);
	}
};

// Increase Posts Rating EVENT HANDLER --> DEV
if (document.querySelector('.event-delegation-1')) {
	document
		.querySelector('.event-delegation-1')
		.addEventListener('click', likePost);
}

if (document.querySelector('#password-reset-form')) {
	console.log('the event handler exists here');
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

if (document.getElementById('purchaseTitle-Grill-Master')) {
	document
		.getElementById('purchaseTitle-Grill-Master')
		.addEventListener('click', (e) => {
			e.target.textContent = 'Processing...';
			const { title } = e.target.dataset;
			purchaseTitle(title);
		});
} else {
	console.log('bark bark');
}
