const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../../config/jwt');

//controller
const {
	getAllUserAddresses,
	// getAddressById,
	createAddress,
	updateAddressById,
	deleteAddressById,
	setDefaultAddress,
	updateDefaultAddress,
} = require('../../controller/address.controller');

// @method: GET '/'
// @desc: get a list of all addresses for user
// @access: private

router.get('/', verifyAccessToken, getAllUserAddresses);

// @method: GET '/:id'
// @desc: get a address by id
// @access: public

// router.get('/:id', getAddressById);

// @method: POST '/'
// @desc: create an address
// @access: private

router.post('/', verifyAccessToken, createAddress);

// @method: PATCH '/:id'
// @desc: update address by id
// @access: private

router.patch('/:id', verifyAccessToken, updateAddressById);

// @method: DELETE '/:id'
// @desc:  delete address
// @access: private

router.delete('/:id', verifyAccessToken, deleteAddressById);

module.exports = router;
