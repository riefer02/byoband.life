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
	console.log(event);
	let postID = event.target.parentNode.parentNode.parentNode.id;
	console.log(postID);
	if (postID) {
		increaseValue(postID);
		// SENDS TO EXPRESS ROUTE TO UPDATE RATING IN DATABASE
		increaseRating(postID);
	}
};

const likePostTwo = (event) => {
	console.log(event);
	let postID = event.target.parentNode.parentNode.id;
	console.log(postID);
	if (postID) {
		increaseValue(postID);
		increaseRating(postID);
	}
};

document.addEventListener('touchstart', (event) => {
	console.log(event);
});

// Increase Posts Rating EVENT HANDLER for Home Page
if (document.querySelector('.event-delegation-1')) {
	document
		.querySelector('.event-delegation-1')
		.addEventListener('touch', likePost, false);
	document
		.querySelector('.event-delegation-1')
		.addEventListener('click', likePost, false);
} else {
	console.log('kaw');
}

// INCREASE RATING EVENT HANDLER FOR INDIVIDUAL POST PAGES
if (document.querySelector('.event-delegation-2')) {
	document
		.querySelector('.event-delegation-2')
		.addEventListener('touch', likePostTwo, false);
	document
		.querySelector('.event-delegation-2')
		.addEventListener('click', likePostTwo, false);
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

// Purchase Title Event Handler
if (document.querySelector('.purchaseTitle')) {
	// document.querySelectorAll('.purchaseTitle').forEach((el) => {
	// 	addEventListener(
	// 		'touch',
	// 		(e) => {
	// 			if (e.target.nodeName === 'BUTTON') {
	// 				e.target.textContent = 'Processing...';
	// 				const { title } = e.target.dataset;
	// 				purchaseTitle(title);
	// 			} else {
	// 				console.log(`I won't do that sir.`);
	// 			}
	// 		},
	// 		false
	// 	);
	// });

	document.querySelectorAll('.purchaseTitle').forEach((el) => {
		addEventListener(
			'click',
			(e) => {
				console.log(e.target.nodeName);
				if (e.target.nodeName === 'BUTTON') {
					e.target.textContent = 'Processing...';
					const { title } = e.target.dataset;
					purchaseTitle(title);
				} else {
					console.log(`I won't do that sir.`);
				}
			},
			false
		);
	});
} else {
	console.log('bark');
}
