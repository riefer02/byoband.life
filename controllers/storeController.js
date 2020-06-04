const stripe = require('stripe')('sk_test_xIZogVHjO50glsIxzWUu6lb400GW7MTVXO');

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
			)}/store/checkout-success`,

			// success_url: `${req.protocol}://${req.get(
			// 	'host'
			// )}/store/checkout-success/${user._id}/${req.params.title}`,
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

		console.log(session.success_url);

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
	res.status(200).json({
		message: 'mission success',
	});
	// const { id, title } = req.params;
	// const user = await User.findByIdAndUpdate(id, { role: title }, { new: true });

	// console.log(user.role);

	// res.render('checkoutSuccess', {
	// 	user,
	// });
};

const createTitleCheckout = async (session) => {
	const buyer = session.metadata.buyer;
	const title = session.client_reference_id;
	const user = await User.findAndUpdate(
		{ username: buyer },
		{ role: title },
		{ new: true }
	);

	console.log(user.role);

	res.render('checkoutSuccess', {
		user,
	});
};

exports.webhookCheckout = (req, res, next) => {
	console.log('testing');
	const signature = req.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			'whsec_Wp4OkQ3AlellFDbvJexjcKokn6AOOBKh'
		);
	} catch (error) {
		return res.status(400).send(`Webhook error ${error.message}`);
	}

	if (event.type === 'checkout.session.completed') {
		createTitleCheckout(event.data.object);

		res.status(200).json({ recieved: true });
	}
};
