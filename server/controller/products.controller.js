const createError = require('http-errors');
const pool = require('../config/db');
const { productSchema } = require('../config/joi');

module.exports = {
	getAllProducts: async (req, res, next) => {
		try {
			const { rows } = await pool.query(`SELECT * FROM products`);
			if (rows.length === 0) {
				throw createError.NotFound('no products found');
			}
			res.json(rows);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	getProductsById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { rows } = await pool.query(
				'SELECT * FROM products WHERE product_id = $1',
				[id]
			);
			if (rows.length === 0) {
				throw createError.NotFound(`no product with id of ${id} was found`);
			}
			res.json(rows[0]);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	createProduct: async (req, res, next) => {
		try {
			const { product_name, price, price_type, category, stock } =
				await productSchema.validateAsync(req.body);
			if (req.file == undefined) {
				throw createError.BadRequest('No file selected');
			}
			const filename = req.file.filename;
			const { rows } = await pool.query(
				'SELECT * FROM products WHERE product_name = $1',
				[product_name]
			);
			if (rows.length > 0)
				throw createError.Conflict(`${product_name} is already in store`);

			const product = await pool.query(
				`INSERT INTO products(product_name,price,price_type,category,stock,image) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
				[product_name, price, price_type, category, stock, filename]
			);
			res.json(product.rows[0]);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},

	updateProductById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { product_name, price, price_type, category, stock } =
				await productSchema.validateAsync(req.body);
			if (req.file == undefined) {
				throw createError.BadRequest('No file selected');
			}
			const filename = req.file.filename;
			const { rows } = await pool.query(
				'SELECT * FROM products WHERE product_id = $1',
				[id]
			);
			if (rows.length === 0)
				throw createError.NotFound(`no product with id of ${id} was found`);
			const updated = await pool.query(
				`UPDATE products SET product_name=$1,price=$2,price_type=$3,category=$4,stock=$5,image=$6 WHERE product_id=$7 RETURNING *`,
				[product_name, price, price_type, category, stock, filename, id]
			);
			res.json(updated.rows[0]);
		} catch (err) {
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},
	deleteProductById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { rows } = await pool.query(
				`DELETE FROM products WHERE product_id = $1 RETURNING *`,
				[id]
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
