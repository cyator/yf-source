const createError = require('http-errors');
const pool = require('../config/db');
const { orderSchema } = require('../config/joi');

module.exports = {
	getAllOrders: async (req, res, next) => {
		try {
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				`SELECT order_id,product_id,product_name,price,category,stock,image,quantity FROM orders_view WHERE customer_id=$1`,
				[req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound('no orders found');
			}
			res.json(rows);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	getOrdersById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				'SELECT order_id,product_id,product_name,price,category,stock,image,quantity FROM orders_view WHERE order_id = $1 AND customer_id=$2',
				[id, req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound(`no order with id of ${id} was found`);
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	createOrder: async (req, res, next) => {
		try {
			const { CheckoutRequestID, cart, amount, shipping } =
				await orderSchema.validateAsync(req.body);

			const stk = await pool.query(
				'SELECT * FROM stk WHERE CheckoutRequestID = $1',
				[CheckoutRequestID]
			);
			if (stk.rows.length === 0)
				throw createError.BadRequest('invalid CheckoutRequestID');

			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}

			const order = await pool.query(
				`INSERT INTO orders(payment_id,customer_id,amount_payable,shipping_cost) VALUES ($1,$2,$3,$4) RETURNING *`,
				[stk.rows[0].payment_id, req.payload.aud, amount, shipping]
			);
			if (order.rows.length === 0) {
				throw createError('could not save order');
			}
			cart.map(async ({ product_id, quantity }) => {
				const cart = await pool.query(
					`INSERT INTO cart(order_id,product_id,quantity) VALUES ($1,$2,$3)  RETURNING *`,
					[order.rows[0].order_id, product_id, quantity]
				);
				if (cart.rows.length === 0) {
					throw createError('could not save order');
				}
			});
			const savedCart = await pool.query(
				'SELECT * FROM cart WHERE order_id = $1',
				[order.rows[0].order_ids]
			);
			res.json(order.rows[0]);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},

	deleteOrderById: async (req, res, next) => {
		try {
			const { id } = req.params;
			if (!req?.payload?.aud) {
				throw createError.Unauthorized();
			}
			const { rows } = await pool.query(
				`DELETE FROM orders WHERE order_id = $1 AND customer_id=$2 RETURNING *`,
				[id, req.payload.aud]
			);
			if (rows.length === 0) {
				throw createError.NotFound('order not found');
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
};
