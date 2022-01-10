import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Product } from '../products/productSlice';
import { toast } from 'react-toastify';

export interface CartState {
	cart: Product[];
	subtotal: number;
	total: number;
}

const initialState: CartState = {
	cart: [],
	subtotal: 0,
	total: 0,
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addToCart: (state, { payload }: PayloadAction<Product>) => {
			const found = state.cart.some(
				({ product_id }) => product_id === payload.product_id
			);
			if (!found) {
				state.cart.push(payload);
				toast.success('Item added to cart');
			} else {
				toast.warn('item is already in cart');
			}
		},
		removeFromCart: (state, { payload }: PayloadAction<number>) => {
			state.cart = state.cart.filter(
				(product) => product.product_id !== payload
			);
		},
		clearCart: (state) => {
			state.cart = [];
			state.subtotal = 0;
			state.total = 0;
		},
		increaseQuantity: (state, { payload }: PayloadAction<number>) => {
			state.cart = state.cart.map((product) => {
				if (product.product_id === payload) {
					product.quantity >= 0 && product.quantity++;
				}
				return product;
			});
		},
		decreaseQuantity: (state, { payload }: PayloadAction<number>) => {
			state.cart = state.cart.map((product) => {
				if (product.product_id === payload) {
					product.quantity > 1 && product.quantity--;
				}
				return product;
			});
		},
		computeSubTotal: (state) => {
			const subtotal = state.cart.reduce(
				(total, { price, quantity }) => total + price * quantity,
				0
			);
			state.subtotal = subtotal;
		},
		computeTotal: (state, { payload }: PayloadAction<number>) => {
			state.total = state.subtotal + payload;
		},
	},
});

export const {
	addToCart,
	removeFromCart,
	clearCart,
	increaseQuantity,
	decreaseQuantity,
	computeSubTotal,
	computeTotal,
} = cartSlice.actions;
export const cartState = (state: RootState) => state.cart;

export default cartSlice.reducer;
