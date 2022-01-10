import instance from '../../config/axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ProductState {
	products: Product[];
	isLoading: boolean;
	error: Error;
}

export interface Product {
	product_id: number;
	product_name: string;
	price: number;
	price_type: string;
	category: string;
	stock: number;
	image: string;
	quantity: number;
}

export interface Error {
	status: number | null;
	message: string;
}

const initialState: ProductState = {
	products: [
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

export const fetchAllProducts = createAsyncThunk(
	'products/fetchAllProducts',
	async (value, thunkAPI) => {
		try {
			const response = await instance.get('/api/products');
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
			console.log('fetchAllProducts error', error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		setProduct: (state, { payload }: PayloadAction<Product[]>) => {
			state.products = payload;
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
			.addCase(fetchAllProducts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = action.payload ?? [
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
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllProducts.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError, setProduct } = productSlice.actions;
export const productState = (state: RootState) => state.product;

export default productSlice.reducer;
