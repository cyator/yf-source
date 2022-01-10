const createError = require('http-errors');
const pool = require('../config/db');
const { defaultAddressSchema } = require('../config/joi');

module.exports = {
	getDefaultAddress: async (req, res, next) => {
		try {
			if (!req.payload.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				'SELECT default_address_id,address_id,first_name,last_name,mobile_phone_number,alternate_phone_number,delivery_address,county,town FROM default_address_view WHERE customer_id = $1',
				[req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound(`default address not found`);
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	setDefaultAddress: async (req, res, next) => {
		try {
			const { address_id } = await defaultAddressSchema.validateAsync(req.body);
			const { rows } = await pool.query(
				'SELECT * FROM default_addresses WHERE customer_id = $1 AND address_id=$2',
				[req.payload.aud, address_id]
			);
			if (rows.length > 0)
				throw createError.Conflict(
					`address ${address_id} is already set to default`
				);
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const default_address = await pool.query(
				`INSERT INTO default_addresses(customer_id,address_id) VALUES ($1,$2) RETURNING *`,
				[req.payload.aud, address_id]
			);
			res.json(default_address.rows[0]);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},
	updateDefaultAddress: async (req, res, next) => {
		try {
			const { address_id } = await defaultAddressSchema.validateAsync(req.body);
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const updated = await pool.query(
				`UPDATE default_addresses SET address_id=$1 WHERE customer_id=$2 RETURNING *`,
				[address_id, req.payload.aud]
			);
			if (updated.rows.length === 0) {
				throw createError.NotFound('default address not found');
			}
			res.json(updated.rows[0]);
		} catch (err) {
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},
	deleteDefaultAddressById: async (req, res, next) => {
		try {
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				`DELETE FROM default_addresses WHERE customer_id = $1 RETURNING *`,
				[req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound('default address not found');
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
};
