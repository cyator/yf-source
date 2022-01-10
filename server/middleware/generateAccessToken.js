const { default: axios } = require('axios');

const generateAccessToken = (req, res, next) => {
	const url =
		'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
	const auth_str = `${process.env.consumer_key}:${process.env.consumer_secret}`;
	const auth = Buffer.from(auth_str, 'utf8').toString('base64');

	axios({
		method: 'GET',
		url,
		headers: {
			Authorization: `Basic ${auth}`,
			'Content-Type': 'application/json',
		},
	})
		.then((res) => {
			console.log('token', res.data);
			const { access_token } = res.data;
			req.access_token = access_token;
			next();
		})
		.catch((err) => console.log(err.response));
};

module.exports = generateAccessToken;
