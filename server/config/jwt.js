const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('../config/redis');

module.exports = {
	signAccessToken: (userId) => {
		return new Promise((resolve, reject) => {
			const payload = {};
			const secret = process.env.ACCESS_TOKEN_SECRET;
			const options = {
				expiresIn: '1d',
				issuer: 'yotefresh.com',
				audience: `${userId}`,
			};
			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message);
					return reject(createError.InternalServerError());
				}

				resolve(token);
			});
		});
	},
	verifyAccessToken: (req, res, next) => {
		if (!req.headers['authorization']) return next(createError.Unauthorized());
		const authHeader = req.headers['authorization'].split(' ');
		const accessToken = authHeader[1];
		// const { accessToken } = req.cookies;
		if (!accessToken) return next(createError.Unauthorized());
		jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
			if (err) {
				const message =
					err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
				return next(createError.Unauthorized(message));
			}
			req.payload = payload;
			next();
		});
	},
	signRefreshToken: (userId) => {
		return new Promise((resolve, reject) => {
			const payload = {};
			const secret = process.env.REFRESH_TOKEN_SECRET;
			const options = {
				expiresIn: '7d',
				issuer: 'yotefresh.com',
				audience: `${userId}`,
			};
			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message);
					return reject(createError.InternalServerError());
				}
				client.SET(userId, token, 'EX', 7 * 24 * 60 * 60, (err, reply) => {
					if (err) {
						console.log(err.message);
						return reject(createError.InternalServerError());
					}
					resolve(token);
				});
			});
		});
	},
	verifyRefreshToken: (refreshToken) => {
		return new Promise((resolve, reject) => {
			jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				(err, payload) => {
					if (err) {
						console.log(err.message);
						return reject(createError.Unauthorized());
					}

					const userId = payload.aud;

					client.GET(userId, (err, reply) => {
						if (err) {
							console.log(err.message);
							return reject(createError.InternalServerError());
						}
						if (refreshToken === reply) return resolve(userId);
						reject(createError.Unauthorized());
					});
				}
			);
		});
	},
};
