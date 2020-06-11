import { resetPassword } from './passwordReset';
import { increaseRating } from './increaseRating';
import { purchaseTitle } from './stripe.js';

const increaseValue = (postID) => {
	let ratingValue = parseInt(
		document.getElementById(`${postID}--rating`).innerHTML
	);
	// UPDATES RATING VALUE ON THE FRONT END
	ratingValue += 1;
	document.getElementById(`${postID}--rating`).innerHTML = ratingValue;
};

const likePost = (event) => {
	// EVENT DELEGATION
	let postID = event.target.parentNode.parentNode.parentNode.id;
	if (postID) {
		increaseValue(postID);
		// SENDS TO EXPRESS ROUTE TO UPDATE RATING IN DATABASE
		increaseRating(postID);
	}
};

const likePostTwo = (event) => {
	let postID = event.target.parentNode.id;
	if (postID) {
		increaseValue(postID);
		increaseRating(postID);
	}
};

// Increase Posts Rating EVENT HANDLER for Home Page
if (document.querySelector('.event-delegation-1')) {
	document
		.querySelector('.event-delegation-1')
		.addEventListener('click', likePost);
	document
		.querySelector('.event-delegation-1')
		.addEventListener('touchstart', likePost);
} else {
	console.log('kaw');
}

// INCREASE RATING EVENT HANDLER FOR INDIVIDUAL POST PAGES
if (document.querySelector('.event-delegation-2')) {
	document
		.querySelector('.event-delegation-2')
		.addEventListener('click', likePostTwo);
	document
		.querySelector('.event-delegation-2')
		.addEventListener('touchstart', likePost);
} else {
	console.log('moo');
}

// Password Reset EVENT HANDLER
if (document.querySelector('#password-reset-form')) {
	console.log('the event handler exists here');

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

// Purchase Title Event Handler Prototype
if (document.querySelector('.purchaseTitle')) {
	document.querySelectorAll('.purchaseTitle').forEach((el) => {
		addEventListener('click', (e) => {
			e.target.textContent = 'Processing...';
			const { title } = e.target.dataset;
			purchaseTitle(title);
		});
	});
} else {
	console.log('bark');
}
