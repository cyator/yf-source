require('dotenv').config();
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const app = express();

app.use(
	cors({
		origin: process.env.NODE_ENV === 'development' ? '*' : process.env.ORIGIN,
		credentials: true,
	})
);

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
	})
);

if (process.env.NODE_ENV === 'development') {
	app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/products', require('./Routes/api/products.routes'));
apiRouter.use('/orders', require('./Routes/api/orders.routes'));
apiRouter.use('/favorites', require('./Routes/api/favorites.routes'));
apiRouter.use('/images', require('./Routes/uploads.routes'));
apiRouter.use('/addresses', require('./Routes/api/addresses.routes'));
apiRouter.use(
	'/default-address',
	require('./Routes/api/defaultAddress.routes')
);
app.use('/auth', require('./Routes/auth.routes'));
app.use('/stk', require('./Routes/stk.routes'));
// app.use('/newsletter', require('./Routes/newsletter.routes'));

app.use(express.static('./uploads'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError.NotFound());
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		status: err.status || 500,
		message: err.message || 'Internal Server Error',
	});
});

module.exports = app;
