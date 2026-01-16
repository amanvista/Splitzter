import { Person } from '@app-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadCurrentUser, loginUser } from './thunks';

interface UserState {
  currentUser: Person | null;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Person | null>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { setCurrentUser, clearCurrentUser, setUserLoading } = userSlice.actions;
export default userSlice.reducer;
