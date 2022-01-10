import instance from '../../config/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { clearCart } from '../cart/cartSlice';
import { resetActiveTab } from '../products/tabSlice';
import { resetSideNav } from '../navigation/sideNavSlice';

export interface AuthState {
	isAuthenticated: boolean;
	user: User;
	token: string;
	isLoading: boolean;
	error: Error;
}

interface User {
	email: string;
	username: string;
}

export interface Error {
	status: number | null;
	message: string;
}

export interface Credentials {
	email: string;
	password: string;
}

export interface RegisterInfo {
	username: string;
	email: string;
	password: string;
}
const token = localStorage.getItem('token');
const initialState: AuthState = {
	isAuthenticated: token ? true : false,
	token: token ?? '',
	user: {
		email: '',
		username: '',
	},
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const attemptLogin = createAsyncThunk(
	'auth/attemptLogin',
	async ({ email, password }: Credentials, thunkAPI) => {
		try {
			const response = await instance.post('/auth/login', { email, password });
			const data: string = response.data;
			if (response.status === 200) {
				localStorage.setItem('token', data);
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

export const refreshToken = createAsyncThunk(
	'auth/refreshToken',
	async (value, thunkAPI) => {
		try {
			const response = await instance.post('/auth/refresh-token');
			const data: string = response.data;
			if (response.status === 200) {
				localStorage.setItem('token', data);
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

export const register = createAsyncThunk(
	'auth/register',
	async ({ username, email, password }: RegisterInfo, thunkAPI) => {
		try {
			const response = await instance.post('/auth/register', {
				username,
				email,
				password,
			});
			const data: string = response.data;
			if (response.status === 200) {
				localStorage.setItem('token', data);
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error: any) {
			console.log(error.response.data);
			return thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const logout = createAsyncThunk(
	'auth/logout',
	async (history: any, { getState, dispatch, rejectWithValue }) => {
		try {
			const response = await instance.delete('/auth/logout');
			if (response.status === 204) {
				localStorage.removeItem('token');
				dispatch(clearCart());
				dispatch(resetActiveTab());
				dispatch(resetSideNav());
				history.push('/');
				return;
			} else {
				return rejectWithValue(response);
			}
		} catch (error: any) {
			console.log(error.response.data);
			return rejectWithValue(error.response.data);
		}
	}
);

export const fetchUser = createAsyncThunk(
	'auth/fetchUser',
	async (value, { getState, dispatch, rejectWithValue }) => {
		try {
			const response = await instance.get('/auth/user');
			const data: User = response.data;
			if (response.status === 200) {
				return data;
			} else {
				return rejectWithValue(response);
			}
		} catch (error: any) {
			console.log(error.response.data);
			return rejectWithValue(error.response.data);
		}
	}
);

export const authSlice = createSlice({
	name: 'auth',
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
			.addCase(attemptLogin.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(attemptLogin.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.token = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(attemptLogin.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(register.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.token = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(register.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(refreshToken.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(refreshToken.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.token = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(refreshToken.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(logout.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(logout.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = {
					email: '',
					username: '',
				};
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(logout.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(fetchUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchUser.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError } = authSlice.actions;

export const authState = (state: RootState) => state.auth;

export default authSlice.reducer;
