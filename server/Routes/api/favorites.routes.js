const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../../config/jwt');

//controller
const {
	getAllFavorites,
	// getFavoriteById,
	createFavorite,
	deleteFavoriteById,
	// updateFavoriteById,
} = require('../../controller/favorites.controller');

// @method:get '/'
// @desc: fetch all favorites
// @access: private

router.get('/', verifyAccessToken, getAllFavorites);

// @method:get '/:id'
// @desc: fetch favorites by id
// @access: private

// router.get('/:id', getFavoriteById);

// @method:post '/'
// @desc: add to favorites
// @access: private

router.post('/', verifyAccessToken, createFavorite);

// @method:patch '/:id'
// @desc: update favorite by id
// @access: private

// router.patch('/:id', verifyAccessToken, updateFavoriteById);

// @method:delete '/:id'
// @desc: remove product from Favorites
// @access: private

router.delete('/:id', verifyAccessToken, deleteFavoriteById);

module.exports = router;
