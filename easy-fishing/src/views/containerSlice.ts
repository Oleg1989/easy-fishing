import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { fetchContainer } from './containerAPI';
import { ContainerState } from './interface/InterfaceContainerState';

const initialState: ContainerState = {
  isAuthenticated: true,
  flagAddLocation: false,
  user: null,
  publicLocations: [],
  status: 'idle',
};

export const incrementAsync = createAsyncThunk(
  'container/fetchCount',
  async (amount: number) => {
    const response = await fetchContainer(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const containerSlice = createSlice({
  name: 'container',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    turnOnAddLocation: (state) => {
      state.flagAddLocation = true;
    },
    activateSingOut: (state) => {
      state.isAuthenticated = !state.isAuthenticated;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value += action.payload;
  //     });
  // },
});

export const { turnOnAddLocation, activateSingOut } = containerSlice.actions;

export const selectPublicLocations = (state: RootState) => state.container.publicLocations;
export const selectUserLocations = (state: RootState) => state.container.user?.locations;
export const selectIsAuthenticated = (state: RootState) => state.container.isAuthenticated;
export const selectFlagAddLocation = (state: RootState) => state.container.flagAddLocation;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount: number): AppThunk => (
//   dispatch,
//   getState
// ) => {
//   const currentValue = selectContainer(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default containerSlice.reducer;