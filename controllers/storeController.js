const stripe = require('stripe')('sk_test_xIZogVHjO50glsIxzWUu6lb400GW7MTVXO');

const User = require('../models/User');

exports.titleStore = (req, res, next) => {
	res.render('store');
};

exports.getCheckoutSession = async (req, res, next) => {
	try {
		const {title} = req.params;
		// GET USER
		const user = await User.findById(req.session.userID);

		// 2) Create Checkout Session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			success_url: `${req.protocol}://${req.get(
				'host'
			)}/store/checkout-success/${user._id}/${req.params.title}`,
			cancel_url: `${req.protocol}://${req.get('host')}/`,
			customer_email: user.email,
			client_reference_id: req.params.title,
			line_items: [
				{
					name: `Title Upgrade: ${title}`,
					description: `Upgrade ${user.username} to ${title} status.`,
					amount: 5 * 100,
					currency: 'usd',
					quantity: 1,
				},
			],
		});

		// user.role = title;

		// 3) Render Session as Response
		res.status(200).json({
			status: 'success',
			session,
		});
	} catch (error) {
		console.log(`Here is the error sir: ${error}`);
	}
};

exports.updateUserTitle = async (req, res, next) => {
	//This is only temporary because it's unsecure...
	const userID = req.query.id;
	const {title} = req.query;

	if (!userID && !title) {
		return next();
	}

	await User.findByIdAndUpdate(userID, { role: title });

	res.redirect(`req.originalUrl.split('?')[0]`);
};

exports.goToCheckoutSuccess = async (req, res, next) => {
	const { id, title } = req.params;
	const user = await User.findByIdAndUpdate(id, { role: title }, { new: true });

	console.log(id);
	console.log(title);
	console.log(user.role);
	res.end();
};
