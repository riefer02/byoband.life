const stripe = require('stripe')('sk_live_AlUipn3a0XfyDiN0DpBxC6Bj00HjC3PGTz');

const User = require('../models/User');

exports.titleStore = (req, res, next) => {
	res.render('store');
};

exports.getCheckoutSession = async (req, res, next) => {
	try {
		const { title } = req.params;
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
			metadata: {
				buyer: user.username,
			},
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

exports.goToCheckoutSuccess = async (req, res, next) => {
	// res.status(200).json({
	// 	message: 'mission success',
	// });
	const { id, title } = req.params;
	const user = await User.findByIdAndUpdate(id, { role: title }, { new: true });

	console.log(user.role);

	res.render('checkoutSuccess', {
		user,
	});
};

const createTitleCheckout = async (session) => {
	res.status(200).end();
};

exports.webhookCheckout = (req, res, next) => {
	console.log('testing');
	const signature = req.headers['stripe-signature'];

	let event;
	console.log('this is happening');

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			'whsec_gU7h4Evp2fN5b8x4iQg2fswWqSDx0be5'
		);
	} catch (error) {
		return res.status(400).send(`Webhook error ${error.message}`);
	}

	if (event.type === 'checkout.session.completed') {
		console.log('this is true!');
		createTitleCheckout(event.data.object);

		res.status(200).json({ recieved: true });
	}
};
