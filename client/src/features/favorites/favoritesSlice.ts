import instance from '../../config/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { toast } from 'react-toastify';

export interface FavoritesState {
	favorites: Favorite[];
	isLoading: boolean;
	error: Error;
}

interface Favorite {
	favorite_id: number;
	product_id: number;
	product_name: string;
	price: number;
	price_type: string;
	category: string;
	stock: number;
	image: string;
}

export interface Error {
	status: number | null;
	message: string;
}

const initialState: FavoritesState = {
	favorites: [],
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllFavorites = createAsyncThunk(
	'favorites/fetchAllFavorites',
	async (value, thunkAPI) => {
		try {
			const response = await instance.get('/api/favorites');
			const data: Favorite[] = response.data;
			if (response.status === 200) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('fetchAllFavorites error', error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const addToFavorites = createAsyncThunk(
	'favorites/addToFavorites',
	async (product_id: number, { getState, dispatch, rejectWithValue }) => {
		try {
			const response = await instance.post('api/favorites', { product_id });
			const data: Favorite = response.data;
			if (response.status === 200) {
				toast.success('Item added to favorites');
				return data;
			} else {
				return rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('addToFavorites error', error.response.data);
			return rejectWithValue(error.response?.data);
		}
	}
);

export const removeFromFavorites = createAsyncThunk(
	'favorites/removeFromFavorites',
	async (favorite_id: number, { getState, dispatch, rejectWithValue }) => {
		try {
			const response = await instance.delete(`api/favorites/${favorite_id}`);
			const data: Favorite = response.data;
			if (response.status === 200) {
				toast.success('Item removed from favorites');
				return data;
			} else {
				return rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('removeFromFavorites error', error.response.data);
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const favoritesSlice = createSlice({
	name: 'favorites',
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
			.addCase(fetchAllFavorites.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllFavorites.fulfilled, (state, action) => {
				state.isLoading = false;
				state.favorites = action.payload ?? [
					{
						favorite_id: 0,
						product_id: 0,
						product_name: '',
						price: 0,
						price_type: '',
						category: '',
						stock: 0,
						image: '',
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllFavorites.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(addToFavorites.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addToFavorites.fulfilled, (state, action) => {
				state.isLoading = false;
				state.favorites.push(action.payload);
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(addToFavorites.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(removeFromFavorites.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(removeFromFavorites.fulfilled, (state, action) => {
				state.isLoading = false;
				const filtered = state.favorites.filter(
					({ favorite_id }) => favorite_id !== action.payload.favorite_id
				);
				state.favorites = filtered;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(removeFromFavorites.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError } = favoritesSlice.actions;
export const favoritesState = (state: RootState) => state.favorites;

export default favoritesSlice.reducer;
