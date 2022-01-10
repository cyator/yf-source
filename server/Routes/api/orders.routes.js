const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../../config/jwt');

//controller
const {
	getAllOrders,
	createOrder,
	deleteOrderById,
} = require('../../controller/orders.controller');

// @method:get '/'
// @desc: fetch all orders for user
// @access: private

router.get('/', verifyAccessToken, getAllOrders);

// @method:post '/'
// @desc: create order
// @access: private

router.post('/', verifyAccessToken, createOrder);

// @method:delete '/:id'
// @desc: remove product from Favorites
// @access: private

router.delete('/:id', verifyAccessToken, deleteOrderById);

module.exports = router;
