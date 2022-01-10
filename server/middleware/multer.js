const path = require('path');
const multer = require('multer');
const mbs = 5;

//set storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const path = './uploads';
		cb(null, path);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

// init upload
const upload = multer({
	storage,
	onError: (err, next) => {
		console.log(err.message);
		next(err);
	},
	limits: {
		fileSize: mbs * 1024 * 1024,
	},
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

// check file type

function checkFileType(file, cb) {
	//allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	//check ext
	const extname = filetypes.test(
		path.extname(file.originalname).toLocaleLowerCase()
	);
	// check mime
	const mimetype = filetypes.test(file.mimetype);
	if (mimetype && extname) {
		cb(null, true);
	} else {
		cb('Error: images only');
	}
}

module.exports = upload;
