import axios from 'axios';

const stripe = Stripe('pk_live_4mar4NwJHFoWObczaHjsrM4k00HobilXag');

export const purchaseTitle = async (title) => {
	try {
		// 1) GET SESSION FROM SERVER
		const url = window.location.origin;
		const session = await axios(`${url}/store/checkout-session/${title}`, {
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Access-Control-Allow-Origin': '*',
			},
		});

		console.log(session);

		// 2) CREATE CHECKOUT FORM + CHARGE CREDIT CARD

		await stripe.redirectToCheckout({
			sessionId: session.data.session.id,
		});
	} catch (err) {
		console.log(err);
	}
};
