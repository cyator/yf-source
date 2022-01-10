import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ModalState {
	modal: boolean;
}

const initialState: ModalState = {
	modal: false,
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setModal: (state, { payload }: PayloadAction<boolean>) => {
			state.modal = payload;
		},
	},
});

export const { setModal } = modalSlice.actions;
export const modalState = (state: RootState) => state.modal;

export default modalSlice.reducer;
