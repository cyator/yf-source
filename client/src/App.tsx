import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './features/auth/ProtectedRoute';
import Navbar from './features/navigation/Navbar';
import InfoBar from './features/navigation/InfoBar';
//routes
import Home from './features/products/Home';
import Cart from './features/cart/Cart';
import Shop from './features/products/Shop';
import FooterPortal from './features/navigation/FooterPortal';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Error from './features/misc/Error';
import Checkout from './features/cart/Checkout';
import SideNav from './features/navigation/SideNav';

import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
	authState,
	clearError as clearAuthError,
} from './features/auth/authSlice';
import {
	productState,
	clearError as clearProductsError,
} from './features/products/productSlice';
import {
	favoritesState,
	clearError as clearFavoritesError,
} from './features/favorites/favoritesSlice';
import PaymentModal from './features/cart/PaymentModal';

function App() {
	const { error: authError } = useAppSelector(authState);
	const { error: productsError } = useAppSelector(productState);
	const { error: favoritesError } = useAppSelector(favoritesState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (authError?.status) {
			console.log('authError', authError);
			toast.error(`status: ${authError.status} message: ${authError.message}`);
			dispatch(clearAuthError());
		}
	}, [authError, dispatch]);

	useEffect(() => {
		if (productsError?.status) {
			console.log('productError', productsError);
			toast.error(
				`status: ${productsError.status} message: ${productsError.message}`
			);
			dispatch(clearProductsError());
		}
	}, [productsError, dispatch]);

	useEffect(() => {
		if (favoritesError?.status) {
			console.log('favoritesError', favoritesError);
			toast.error(
				`status: ${favoritesError.status} message: ${favoritesError.message}`
			);
			dispatch(clearFavoritesError());
		}
	}, [favoritesError, dispatch]);

	return (
		<div className="App">
			<InfoBar />
			<Navbar />
			<main>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/shop" component={Shop} />
					{/* <Route path="/offers" component={Offers} /> */}
					<Route path="/cart" component={Cart} />
					<Route path="/login" component={Login} />
					<Route path="/register" component={Register} />
					<ProtectedRoute path="/orders" component={SideNav} />
					<ProtectedRoute path="/favorites" component={SideNav} />
					<ProtectedRoute path="/profile" component={SideNav} />
					<ProtectedRoute path="/addresses" component={SideNav} />
					<ProtectedRoute path="/checkout" component={Checkout} />
					<Route component={Error} />
				</Switch>
			</main>

			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<PaymentModal />
			<FooterPortal />
		</div>
	);
}

export default App;
