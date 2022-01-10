const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../../config/jwt');

//controller
const {
	getDefaultAddress,
	// setDefaultAddress,
	updateDefaultAddress,
	// deleteDefaultAddressById,
} = require('../../controller/defaultAddress.controller');

// @method: GET '/'
// @desc:  get default address
// @access: private

router.get('/', verifyAccessToken, getDefaultAddress);

// @method: POST '/'
// @desc:  set default address
// @access: private

// router.post('/', verifyAccessToken, setDefaultAddress);

// @method: PATCH '/'
// @desc:  update default address
// @access: private

router.patch('/', verifyAccessToken, updateDefaultAddress);

// @method: DELETE '/:id'
// @desc:  delete default address
// @access: private

// router.delete('/', verifyAccessToken, deleteDefaultAddressById);

module.exports = router;
