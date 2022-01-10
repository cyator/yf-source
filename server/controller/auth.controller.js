const createError = require('http-errors');
const {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} = require('../config/jwt');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const client = require('../config/redis');
//validation
const { loginSchema, registerSchema } = require('../config/joi');
const { NotFound } = require('http-errors');

module.exports = {
	register: async (req, res, next) => {
		try {
			const { username, email, password } = await registerSchema.validateAsync(
				req.body
			);
			const { rows } = await pool.query(
				'SELECT * FROM customers WHERE email = $1',
				[email]
			);
			if (rows.length > 0)
				throw createError.Conflict(`${email} is already registered`);
			const hashedPassword = await bcrypt.hash(password, 14);
			const customer = await pool.query(
				`INSERT INTO customers(username,email,password) VALUES ($1,$2,$3) RETURNING *`,
				[username, email, hashedPassword]
			);
			if (customer.rows.length > 0) {
				const accessToken = await signAccessToken(customer.rows[0].customer_id);
				const refreshToken = await signRefreshToken(
					customer.rows[0].customer_id
				);

				res.cookie('refreshToken', refreshToken, {
					secure: process.env.NODE_ENV === 'development' ? false : true,
					httpOnly: true,
					sameSite: true,
				});
				res.json(accessToken);
			} else {
				throw createError.InternalServerError('error registering user');
			}
		} catch (err) {
			if (err.isJoi === true) err.status = 422;
			next(err);
		}
	},
	login: async (req, res, next) => {
		try {
			//validate request
			const { email, password } = await loginSchema.validateAsync(req.body);

			const customer = await pool.query(
				'SELECT * FROM customers WHERE email = $1',
				[email]
			);
			if (!(customer.rows.length > 0)) {
				throw createError.Unauthorized(
					'Invalid Email and Password Combination'
				);
			}
			//compare passwords
			const isMatch = await bcrypt.compare(password, customer.rows[0].password);

			if (!isMatch)
				throw createError.Unauthorized(
					'Invalid Email and Password Combination'
				);

			const accessToken = await signAccessToken(customer.rows[0].customer_id);
			const refreshToken = await signRefreshToken(customer.rows[0].customer_id);
			console.log('env', process.env.NODE_ENV);
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: true,
				secure: process.env.NODE_ENV === 'development' ? false : true,
			});
			res.json(accessToken);
		} catch (error) {
			console.log(error.message);
			if (error.isJoi === true)
				return next(
					createError.BadRequest('Invalid Email and Password Combination')
				);
			next(error);
		}
	},
	refreshToken: async (req, res, next) => {
		try {
			// const { refreshToken } = req.body;
			const { refreshToken } = req.cookies;
			if (!refreshToken) throw createError.BadRequest();
			const userId = await verifyRefreshToken(refreshToken);
			const newAccessToken = await signAccessToken(userId);
			const newRefreshToken = await signRefreshToken(userId);

			res.cookie('refreshToken', newRefreshToken, {
				secure: process.env.NODE_ENV === 'development' ? false : true,
				httpOnly: true,
				sameSite: true,
			});
			res.json(newAccessToken);
		} catch (err) {
			next(err);
		}
	},
	logout: async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) throw createError.BadRequest();
			const userId = await verifyRefreshToken(refreshToken);
			client.DEL(userId, (err, value) => {
				if (err) {
					console.log(err.message);
					throw createError.InternalServerError();
				}
				res.clearCookie('refreshToken');
				res.sendStatus(204);
			});
		} catch (err) {
			next(err);
		}
	},
	getUser: async (req, res, next) => {
		try {
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				'SELECT username, email FROM customers WHERE customer_id = $1',
				[req.payload.aud]
			);
			if (rows.length === 0) {
				throw (createError, NotFound('user not found'));
			}
			res.json(rows[0]);
		} catch (error) {
			console.log(error.message);
			next(error);
		}
	},
};
