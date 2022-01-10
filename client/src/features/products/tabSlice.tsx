import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface TabState {
	activeTab: string;
}

const initialState: TabState = {
	activeTab: 'veggies',
};

export const tabSlice = createSlice({
	name: 'tab',
	initialState,
	reducers: {
		setActiveTab: (state, { payload }: PayloadAction<string>) => {
			state.activeTab = payload;
		},
		resetActiveTab: (state) => {
			state.activeTab = 'veggies';
		},
	},
});

export const { setActiveTab, resetActiveTab } = tabSlice.actions;
export const tabState = (state: RootState) => state.tab;

export default tabSlice.reducer;
