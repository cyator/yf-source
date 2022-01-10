import axios from 'axios';
import { refreshToken } from '../features/auth/authSlice';
import { Store } from '../app/store';

const instance = axios.create();

instance.defaults.baseURL = process.env.REACT_APP_BASE_URL;
instance.defaults.withCredentials = true;

export const interceptor = (store: Store) => {
	instance.interceptors.request.use((request) => {
		if (
			request.method === 'POST' ||
			request.method === 'PATCH' ||
			request.method === 'PUT'
		) {
			request.headers['Content-Type'] = 'application/json;charset=utf-8';
		}

		const auth = store.getState()?.auth;
		if (auth?.token) {
			request.headers.Authorization = `Bearer ${auth.token}`;
		}
		return request;
	});

	instance.interceptors.response.use(
		(response) => response,
		(err) => {
			if (
				err.response.status === 401 &&
				err.response.data.message === 'jwt expired'
			) {
				store.dispatch(refreshToken());
			}

			return Promise.reject(err);
		}
	);
};

export default instance;
