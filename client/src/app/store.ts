import {
	configureStore,
	ThunkAction,
	Action,
	combineReducers,
} from '@reduxjs/toolkit';
import {
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import addressReducer from '../features/address/addressSlice';
import cartReducer from '../features/cart/cartSlice';
import productReducer from '../features/products/productSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import tabReducer from '../features/products/tabSlice';
import authReducer from '../features/auth/authSlice';
import offerReducer from '../features/products/offerSlice';
import sideNavReducer from '../features/navigation/sideNavSlice';
import stkReducer from '../features/cart/stkSlice';
import modalReducer from '../features/cart/modalSlice';
import orderReducer from '../features/cart/orderSlice';

//combine reducers
const reducers = combineReducers({
	address: addressReducer,
	cart: cartReducer,
	product: productReducer,
	tab: tabReducer,
	favorites: favoritesReducer,
	auth: authReducer,
	offer: offerReducer,
	sideNav: sideNavReducer,
	stk: stkReducer,
	modal: modalReducer,
	order: orderReducer,
});

const rootReducer = (state: any, action: any) => {
	return reducers(state, action);
};

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	// whitelist: ['cart', 'address', 'tab'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export type Store = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
