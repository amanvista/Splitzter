// BlinkFeast CounterPro - Redux Store
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import menuReducer from './menuSlice';
import orderReducer from './orderSlice';
import tableReducer from './tableSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    table: tableReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
