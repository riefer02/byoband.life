import { resetPassword } from './passwordReset';

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
