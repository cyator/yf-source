const createError = require('http-errors');
const pool = require('../config/db');
const { favoriteSchema } = require('../config/joi');

module.exports = {
	getAllFavorites: async (req, res, next) => {
		try {
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				`SELECT * FROM favorites_view WHERE customer_id=$1`,
				[req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound('no favorites found');
			}
			res.json(rows);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	getFavoriteById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				'SELECT * FROM favorites_view WHERE favorite_id = $1 AND customer_id=$2',
				[id, req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound(`no favorite with id of ${id} was found`);
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	createFavorite: async (req, res, next) => {
		try {
			const { product_id } = await favoriteSchema.validateAsync(req.body);
			const { rows } = await pool.query(
				'SELECT * FROM favorites WHERE product_id = $1',
				[product_id]
			);
			if (rows.length > 0)
				throw createError.Conflict(`product is already in favorites`);
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const favorite = await pool.query(
				`INSERT INTO favorites(customer_id,product_id) VALUES ($1,$2) RETURNING *`,
				[req.payload.aud, product_id]
			);
			res.json(favorite.rows[0]);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},

	updateFavoriteById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { product_id } = await favoriteSchema.validateAsync(req.body);
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const updated = await pool.query(
				`UPDATE favorites SET product_id=$1,customer_id=$2 WHERE favorite_id=$3 AND customer_id=$4 RETURNING *`,
				[product_id, req.payload.aud, id, req.payload.aud]
			);
			if (updated.rows.length === 0) {
				throw createError.NotFound('favorite not found');
			}
			res.json(updated.rows[0]);
		} catch (err) {
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},
	deleteFavoriteById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				`DELETE FROM favorites WHERE favorite_id = $1 AND customer_id=$2 RETURNING *`,
				[id, req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound('favorite not found');
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
};
