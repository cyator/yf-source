const joi = require('joi');

const registerSchema = joi.object({
	username: joi.string().min(2).max(30),
	email: joi.string().email().lowercase().required(),
	password: joi.string().min(8).max(30).required(),
});
const loginSchema = joi.object({
	email: joi.string().email().lowercase().required(),
	password: joi.string().min(8).max(30).required(),
});
const productSchema = joi.object({
	product_name: joi.string().trim().min(2).max(30).required(),
	price: joi.number().required(),
	price_type: joi.string().trim().min(2).max(30).required(),
	category: joi.string().trim().min(2).max(30).required(),
	stock: joi.number().required(),
});
const favoriteSchema = joi.object({
	product_id: joi.number().required(),
});

const addressSchema = joi.object({
	first_name: joi.string().trim().min(2).max(30).required(),
	last_name: joi.string().trim().min(2).max(30).required(),
	mobile_phone_number: joi
		.string()
		.trim()
		.regex(/^[0-9]{9}$/)
		.required(),
	alternate_phone_number: joi
		.string()
		.trim()
		.regex(/^[0-9]{9}$/)
		.allow(''),
	delivery_address: joi.string().trim().min(2).max(255).required(),
	county: joi.string().trim().min(2).max(30).required(),
	town: joi.string().trim().min(2).max(30).required(),
});

const defaultAddressSchema = joi.object({
	address_id: joi.number().required(),
});

const paymentSchema = joi.object({
	phone_number: joi
		.string()
		.trim()
		.regex(/^[0-9]{9}$/)
		.required(),
	amount: joi.number().required(),
});

const orderSchema = joi.object({
	CheckoutRequestID: joi.string().trim().min(2).max(255).required(),
	cart: joi
		.array()
		.items(
			joi.object({
				product_id: joi.number().required(),
				quantity: joi.number().required(),
			})
		)
		.required(),
	amount: joi.number().required(),
	shipping: joi.number().required(),
});

module.exports = {
	registerSchema,
	loginSchema,
	productSchema,
	favoriteSchema,
	addressSchema,
	defaultAddressSchema,
	paymentSchema,
	orderSchema,
};
