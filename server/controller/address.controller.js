const createError = require('http-errors');
const pool = require('../config/db');
const { addressSchema } = require('../config/joi');

module.exports = {
	getAllUserAddresses: async (req, res, next) => {
		try {
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				`SELECT * FROM addresses WHERE customer_id=$1`,
				[req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound('no addresses found');
			}
			res.json(rows);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	getAddressById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM addresses WHERE address_id = $1',
				[id]
			);
			if (rows.length === 0) {
				throw createError.NotFound(`no address with id of ${id} was found`);
			}
			res.json(rows);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	createAddress: async (req, res, next) => {
		try {
			const {
				first_name,
				last_name,
				mobile_phone_number,
				alternate_phone_number,
				delivery_address,
				county,
				town,
			} = await addressSchema.validateAsync(req.body);
			const { rows } = await pool.query(
				'SELECT * FROM addresses WHERE delivery_address = $1 AND mobile_phone_number =$2',
				[delivery_address, mobile_phone_number]
			);
			if (rows.length > 0)
				throw createError.Conflict(`an identical address is already in store`);
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const address = await pool.query(
				`INSERT INTO addresses(customer_id,first_name,last_name,mobile_phone_number,alternate_phone_number,delivery_address,county,town) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
				[
					req.payload.aud,
					first_name,
					last_name,
					mobile_phone_number,
					alternate_phone_number,
					delivery_address,
					county,
					town,
				]
			);
			const default_address = await pool.query(
				'SELECT * FROM default_addresses WHERE customer_id = $1',
				[req.payload.aud]
			);
			if (default_address.rows.length === 0) {
				const default_address_res = await pool.query(
					`INSERT INTO default_addresses(customer_id,address_id) VALUES ($1,$2) RETURNING *`,
					[req.payload.aud, address.rows[0].address_id]
				);
				if (default_address_res.rows.length === 0) {
					throw createError.InternalServerError(
						'could not set default address'
					);
				}
			}
			res.json(address.rows[0]);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},

	updateAddressById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const {
				first_name,
				last_name,
				mobile_phone_number,
				alternate_phone_number,
				delivery_address,
				county,
				town,
			} = await addressSchema.validateAsync(req.body);
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const updated = await pool.query(
				`UPDATE addresses SET customer_id=$1,first_name=$2,last_name=$3,mobile_phone_number=$4,alternate_phone_number=$5,delivery_address=$6,county=$7,town=$8 WHERE address_id=$9 AND customer_id=$10 RETURNING *`,
				[
					req.payload.aud,
					first_name,
					last_name,
					mobile_phone_number,
					alternate_phone_number,
					delivery_address,
					county,
					town,
					id,
					req.payload.aud,
				]
			);
			if (updated.rows.length === 0) {
				throw createError.NotFound('address not found');
			}
			res.json(updated.rows[0]);
		} catch (err) {
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},
	deleteAddressById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				`DELETE FROM addresses WHERE address_id = $1 AND customer_id=$2 RETURNING *`,
				[id, req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound('address not found');
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
};
