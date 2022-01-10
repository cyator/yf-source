import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Product, Error } from './productSlice';
//axios
const instance = axios.create();
instance.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export interface OfferState {
	offers: Product[];
	isLoading: boolean;
	error: Error;
}

const initialState: OfferState = {
	offers: [
		{
			product_id: 0,
			product_name: '',
			price: 0,
			price_type: '',
			category: '',
			stock: 0,
			image: '',
			quantity: 0,
		},
	],
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllOffers = createAsyncThunk(
	'offer/fetchAllOffers',
	async (value, thunkAPI) => {
		try {
			const response = await instance.get('/api/offers');
			const data: Product[] = response.data;
			if (response.status === 200) {
				const updated = data.map((product) => {
					product.quantity = 1;
					return product;
				});
				return updated;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('fetchAllOffers error', error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const offerSlice = createSlice({
	name: 'offer',
	initialState,
	reducers: {
		setOffer: (state, { payload }: PayloadAction<Product[]>) => {
			state.offers = payload;
		},
		clearError: (state) => {
			state.error = {
				status: null,
				message: '',
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllOffers.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllOffers.fulfilled, (state, action) => {
				state.isLoading = false;
				state.offers = action.payload ?? [
					{
						product_id: '',
						product_name: '',
						price: 0,
						price_type: '',
						category: '',
						stock: 0,
						image: '',
						quantity: 0,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllOffers.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError, setOffer } = offerSlice.actions;
export const offerState = (state: RootState) => state.offer;

export default offerSlice.reducer;
