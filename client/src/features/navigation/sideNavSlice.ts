import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface TabState {
	activeTab: string;
}

const initialState: TabState = {
	activeTab: 'profile',
};

export const sideNavSlice = createSlice({
	name: 'sideNav',
	initialState,
	reducers: {
		setActiveTab: (state, { payload }: PayloadAction<string>) => {
			state.activeTab = payload;
		},
		resetSideNav: (state) => {
			state.activeTab = 'profile';
		},
	},
});

export const { setActiveTab, resetSideNav } = sideNavSlice.actions;
export const sideNavState = (state: RootState) => state.sideNav;

export default sideNavSlice.reducer;
