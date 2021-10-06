import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import containerReducer from '../views/containerSlice';

export const store = configureStore({
  reducer: {
    container: containerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
