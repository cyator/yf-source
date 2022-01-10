const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer');

//controller
const {
	getAllProducts,
	getProductsById,
	// createProduct,
	updateProductById,
	// deleteProductById,
} = require('../../controller/products.controller');

// @method: GET '/'
// @desc: get a list of all products
// @access: public

router.get('/', getAllProducts);

// @method: GET '/:id'
// @desc: get a product by id
// @access: public

router.get('/:id', getProductsById);

// @method: POST '/'
// @desc: create a product
// @access: private

// router.post('/', upload.single('file'), createProduct);

// @method: PATCH '/:id'
// @desc: update product by id
// @access: private

router.patch('/:id', upload.single('file'), updateProductById);

// @method: DELETE '/:id'
// @desc:  delete product by id
// @access: private

// router.delete('/:id', deleteProductById);

module.exports = router;
