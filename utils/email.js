const nodemailer = require('nodemailer');
const ejs = require('ejs');
const htmlToText = require('html-to-text');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.username = user.username;
		this.url = url;
		this.from = `BYOB Life <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// SENDGRID
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					// type: 'OAuth2',
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
					// clientId: process.env.OAUTH2_CLIENT_ID,
					// clientSecret: process.env.OAUTH2_CLIENT_SECRET,
				},
			});
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST_2,
			port: process.env.EMAIL_PORT_2,
			auth: {
				user: process.env.EMAIL_USERNAME_2,
				pass: process.env.EMAIL_PASSWORD_2,
			},
		});
	}

	// SEND the ACTUAL EMAIL
	async send(template, subject) {
		// 1) RENDER HTML base on a template
		const html = await ejs.renderFile(
			`${__dirname}/../views/emails/${template}.ejs`,
			{
				username: this.username,
				url: this.url,
				subject,
			}
		);

		// 2) DEFINE Email Options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html),
		};

		// 3) CREATE A TRANSPORT AND SEND EMAIL
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the BYOB Life Community');
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Your password reset token (valid for 10 minutes)'
		);
	}
};
