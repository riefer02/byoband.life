import axios from 'axios';

const stripe = Stripe('pk_test_Ktxe60dhNkEaxlNYJXm8bfGZ00pMVWvlpu');

export const purchaseTitle = async (title) => {
	try {
		// 1) GET SESSION FROM SERVER
		const url = window.location.origin;
		const session = await axios(`${url}/store/checkout-session/${title}`);

		// 2) CREATE CHECKOUT FORM + CHARGE CREDIT CARD

		await stripe.redirectToCheckout({
			sessionId: session.data.session.id,
		});
	} catch (err) {
		console.log(err);
	}
};