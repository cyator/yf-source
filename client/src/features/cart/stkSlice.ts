import instance from '../../config/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { clearCart } from '../cart/cartSlice';
import { toast } from 'react-toastify';
import { setModal } from './modalSlice';
import { saveOrder } from './orderSlice';

export interface StkState {
	simResponse: SimResponse;
	queryResponse: QueryResponse;
	isLoading: boolean;
	error: Error;
}

interface SimResponse {
	MerchantRequestID: string;
	CheckoutRequestID: string;
	ResponseCode: string;
	ResponseDescription: string;
	CustomerMessage: string;
}

interface QueryResponse {
	ResponseCode: string;
	ResponseDescription: string;
	MerchantRequestID: string;
	CheckoutRequestID: string;
	ResultCode: string;
	ResultDesc: string;
}

export interface Error {
	status: number | null;
	message: string;
}

const initialState: StkState = {
	simResponse: {
		MerchantRequestID: '',
		CheckoutRequestID: '',
		ResponseCode: '',
		ResponseDescription: '',
		CustomerMessage: '',
	},
	queryResponse: {
		ResponseCode: '',
		ResponseDescription: '',
		MerchantRequestID: '',
		CheckoutRequestID: '',
		ResultCode: '',
		ResultDesc: '',
	},

	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const simulatePayment = createAsyncThunk(
	'stk/simulatePayment',
	async (
		{ phone_number, amount }: { phone_number: string; amount: number },
		thunkAPI
	) => {
		try {
			const response = await instance.post('/stk', { phone_number, amount });
			const data: SimResponse = response.data;
			if (response.status === 200) {
				thunkAPI.dispatch(setModal(true));
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log(error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);
export const queryPayment = createAsyncThunk(
	'stk/queryPayment',
	async (
		{ CheckoutRequestID, history }: { CheckoutRequestID: string; history: any },
		thunkAPI
	) => {
		try {
			const response = await instance.post('/stk/query', { CheckoutRequestID });
			const data: QueryResponse = response.data;
			if (response.status === 200) {
				if (+data.ResultCode === 0) {
					thunkAPI.dispatch(setModal(false));
					const { cart } = thunkAPI.getState() as RootState;
					thunkAPI.dispatch(
						saveOrder({
							CheckoutRequestID: data.CheckoutRequestID,
							cart: cart.cart.map(({ product_id, quantity }) => ({
								product_id,
								quantity,
							})),
							amount: cart.total,
							shipping: cart.total - cart.subtotal,
						})
					);
					toast.success('payment successful');
					thunkAPI.dispatch(clearCart());
					history.push('/');
					return data;
				} else {
					thunkAPI.dispatch(setModal(false));
					toast.error(data.ResultDesc);
					return thunkAPI.rejectWithValue(data);
				}
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log(error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const stkSlice = createSlice({
	name: 'stk',
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
			.addCase(simulatePayment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(simulatePayment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.simResponse = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(simulatePayment.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(queryPayment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(queryPayment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.queryResponse = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(queryPayment.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError } = stkSlice.actions;

export const stkState = (state: RootState) => state.stk;

export default stkSlice.reducer;
