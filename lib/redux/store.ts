// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './rootReducer';

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
