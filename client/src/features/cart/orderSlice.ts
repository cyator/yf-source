import instance from '../../config/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface OrderState {
	orders: Order[];
	isLoading: boolean;
	error: Error;
}

interface Order {
	order_id: number;
	product_id: number;
	product_name: string;
	price: number;
	category: string;
	stock: number;
	image: string;
	quantity: number;
}

export interface Error {
	status: number | null;
	message: string;
}

interface SaveOrder {
	cart: Cart[];
	CheckoutRequestID: string;
	amount: number;
	shipping: number;
}

interface Cart {
	product_id: number;
	quantity: number;
}

const initialState: OrderState = {
	orders: [],
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllOrdes = createAsyncThunk(
	'orders/fetchAllOrders',
	async (value, thunkAPI) => {
		try {
			const response = await instance.get('api/orders');
			const data: Order[] = response.data;
			if (response.status === 200) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('fetchAllOrders', error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const saveOrder = createAsyncThunk(
	'orders/saveOrder',
	async (
		{ cart, CheckoutRequestID, amount, shipping }: SaveOrder,
		{ getState, dispatch, rejectWithValue }
	) => {
		try {
			const response = await instance.post('api/orders', {
				CheckoutRequestID,
				cart,
				amount,
				shipping,
			});
			const data: Order = response.data;
			if (response.status === 200) {
				return data;
			} else {
				return rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('saveOrder error', error.response.data);
			return rejectWithValue(error.response?.data);
		}
	}
);

export const orderSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = {
				status: null,
				message: '',
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllOrdes.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllOrdes.fulfilled, (state, action) => {
				state.isLoading = false;
				state.orders = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllOrdes.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(saveOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(saveOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(saveOrder.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError } = orderSlice.actions;
export const orderState = (state: RootState) => state.order;

export default orderSlice.reducer;
