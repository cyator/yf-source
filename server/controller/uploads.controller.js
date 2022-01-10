const fs = require('fs');
const path = require('path');

module.exports = {
	streamFile: (req, res, next) => {
		try {
			const filename = req.params.filename;
			const filepath = path.join('uploads', filename);
			const readStream = fs.createReadStream(filepath, { autoClose: true });
			readStream.pipe(res, { end: true });
			readStream.on('error', (err) => {
				next(err);
			});
			readStream.on('end', () => {
				console.log('Stream Done');
			});
		} catch (error) {
			next(error);
		}
	},
	downloadFile: (req, res, next) => {
		try {
			const filename = req.params.filename;
			const filepath = path.join('uploads', filename);
			res.download(filepath, (err) => {
				next(err);
			});
		} catch (error) {
			next(error);
		}
	},
};
