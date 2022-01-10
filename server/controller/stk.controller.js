const { default: axios } = require('axios');
const createError = require('http-errors');
const pool = require('../config/db');
const setAuthHeader = require('../config/setAuthHeader');
const getTimestamp = require('../config/getTimestamp');
const { paymentSchema } = require('../config/joi');

module.exports = {
	stk: async (req, res, next) => {
		try {
			const { amount, phone_number } = await paymentSchema.validateAsync(
				req.body
			);
			const LNMpasskey = process.env.LNMpasskey;
			const BusinessShortCode = process.env.BusinessShortCode;
			const Password = Buffer.from(
				BusinessShortCode + LNMpasskey + getTimestamp,
				'utf-8'
			).toString('base64');
			const CallBackURL = process.env.CallBackURL;
			const AccountReference = process.env.AccountReference;
			const response = await axios({
				method: 'POST',
				url: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
				headers: setAuthHeader(req),
				data: {
					BusinessShortCode,
					Password,
					Timestamp: getTimestamp,
					TransactionType: 'CustomerPayBillOnline',
					Amount: amount,
					PartyA: +`254${phone_number}`,
					PartyB: BusinessShortCode,
					PhoneNumber: +`254${phone_number}`,
					CallBackURL,
					AccountReference,
					TransactionDesc: 'payment of goods',
				},
			});

			if (!response.status === 200) {
				throw createError.InternalServerError(
					'an error occurred in the payment process'
				);
			}
			if (!response.data.ResponseCode === 0) {
				throw createError(response.data.CustomerMessage);
			}
			res.json(response.data);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},

	CallBackURL: async (req, res, next) => {
		try {
			console.log(
				'............................. CallBackURL .............................'
			);
			const {
				Body: { stkCallback },
			} = req.body;
			console.log('stkCallback', stkCallback);
			const {
				MerchantRequestID,
				CheckoutRequestID,
				ResultCode,
				ResultDesc,
				CallbackMetadata,
			} = stkCallback;

			if (ResultCode !== 0) {
				throw createError('payment failed : ' + ResultDesc);
			}
			req.CheckoutRequestID = CheckoutRequestID;
			const stk = await pool.query(
				`INSERT INTO stk(MerchantRequestID,CheckoutRequestID,ResultCode,ResultDesc,CallbackMetadata) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
				[
					MerchantRequestID,
					CheckoutRequestID,
					ResultCode,
					ResultDesc,
					CallbackMetadata,
				]
			);

			if (stk.rows.length === 0) {
				throw createError.InternalServerError(
					'an error occurred in the payment process'
				);
			}
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
	stkQuery: async (req, res, next) => {
		try {
			const { CheckoutRequestID } = req.body;
			const LNMpasskey = process.env.LNMpasskey;
			const BusinessShortCode = process.env.BusinessShortCode;
			const Password = Buffer.from(
				BusinessShortCode + LNMpasskey + getTimestamp,
				'utf-8'
			).toString('base64');

			const response = await axios({
				method: 'POST',
				url: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
				headers: setAuthHeader(req),
				data: {
					BusinessShortCode,
					Password,
					Timestamp: getTimestamp,
					CheckoutRequestID,
				},
			});
			res.send(response.data);
		} catch (err) {
			console.log(err.response.data);
			next(err);
		}
	},
};
