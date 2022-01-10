import instance from '../../config/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { toast } from 'react-toastify';

export interface AddressState {
	addresses: Address[];
	default_address: Address;
	isLoading: boolean;
	error: Error;
}

export interface Address {
	address_id?: number;
	first_name: string;
	last_name: string;
	mobile_phone_number: string;
	alternate_phone_number: string;
	delivery_address: string;
	county: string;
	town: string;
}

export interface Error {
	status: number | null;
	message: string;
}

const initialState: AddressState = {
	addresses: [
		{
			address_id: 0,
			first_name: '',
			last_name: '',
			mobile_phone_number: '',
			alternate_phone_number: '',
			delivery_address: '',
			county: '',
			town: '',
		},
	],
	default_address: {
		address_id: 0,
		first_name: '',
		last_name: '',
		mobile_phone_number: '',
		alternate_phone_number: '',
		delivery_address: '',
		county: '',
		town: '',
	},
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllAddresses = createAsyncThunk(
	'address/fetchAllAddresses',
	async (value, thunkAPI) => {
		try {
			const response = await instance.get('/api/addresses');
			const data: Address[] = response.data;
			if (response.status === 200) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('fetchAllAddresses error', error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const createAddress = createAsyncThunk(
	'address/createAddress',
	async (address: Address, thunkAPI) => {
		try {
			const response = await instance.post('/api/addresses', { ...address });
			const data: Address = response.data;
			if (response.status === 200) {
				toast.success('address added successfully');
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('fetchAllAddresses error', error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const updateAddress = createAsyncThunk(
	'address/updateAddress',
	async (
		{ id, updates }: { id: number; updates: Address },
		{ getState, dispatch, rejectWithValue }
	) => {
		try {
			const response = await instance.patch(`api/addresses/${id}`, {
				...updates,
			});
			const data: Address = response.data;
			if (response.status === 200) {
				dispatch(fetchDefaultAddress());
				return data;
			} else {
				return rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('update address', error.response.data);
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const deleteAddress = createAsyncThunk(
	'address/deleteAddress',
	async (id: number, { getState, dispatch, rejectWithValue }) => {
		try {
			const response = await instance.delete(`api/addresses/${id}`);
			const data: Address = response.data;
			if (response.status === 200) {
				toast.success('address deleted successfully');
				return data;
			} else {
				return rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('delete address', error.response.data);
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchDefaultAddress = createAsyncThunk(
	'address/fetchDefaultAddress',
	async (value, thunkAPI) => {
		try {
			const response = await instance.get('/api/default-address');
			const data: Address = response.data;
			if (response.status === 200) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('fetchDefaultAddress error', error.response.data);
			return thunkAPI.rejectWithValue(error?.response?.data);
		}
	}
);

export const updateDefaultAddress = createAsyncThunk(
	'address/updateDefaultAddress',
	async (address_id: number, { getState, dispatch, rejectWithValue }) => {
		try {
			const response = await instance.patch(`api/default-address`, {
				address_id,
			});
			const data: Address = response.data;
			if (response.status === 200) {
				return data;
			} else {
				return rejectWithValue(data);
			}
		} catch (error: any) {
			console.log('update address', error.response.data);
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const addressSlice = createSlice({
	name: 'address',
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
			.addCase(fetchAllAddresses.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllAddresses.fulfilled, (state, action) => {
				state.isLoading = false;
				state.addresses = action.payload ?? [
					{
						address_id: '',
						first_name: '',
						last_name: '',
						mobile_phone_number: '',
						alternate_phone_number: '',
						delivery_address: '',
						county: '',
						town: '',
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllAddresses.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(createAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createAddress.fulfilled, (state, action) => {
				state.isLoading = false;
				state.addresses.push(action.payload);
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(createAddress.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(updateAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAddress.fulfilled, (state, action) => {
				state.isLoading = false;
				const updated = state.addresses.map((address) =>
					address.address_id === action.payload.address_id
						? action.payload
						: address
				);
				state.addresses = updated;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(updateAddress.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(deleteAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteAddress.fulfilled, (state, action) => {
				state.isLoading = false;

				const filtered = state.addresses.filter(
					({ address_id }) => address_id !== action.payload.address_id
				);
				state.addresses = filtered;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(deleteAddress.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(fetchDefaultAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchDefaultAddress.fulfilled, (state, action) => {
				state.isLoading = false;
				state.default_address = action.payload ?? {
					address_id: '',
					first_name: '',
					last_name: '',
					mobile_phone_number: 0,
					alternate_phone_number: null,
					delivery_address: '',
					county: '',
					town: '',
				};
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchDefaultAddress.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(updateDefaultAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateDefaultAddress.fulfilled, (state, action) => {
				state.isLoading = false;
				state.default_address = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(updateDefaultAddress.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError } = addressSlice.actions;
export const addressState = (state: RootState) => state.address;

export default addressSlice.reducer;
