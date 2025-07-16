import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  username: string;
  email: string;
  token: string;
  mobile: string;
  spotLength: number;
  auth_owner_id?: number; // Add other fields if needed
}

interface StateWrapper {
  value: UserState;
}

const initialState: StateWrapper = {
  value: {
    isLoggedIn: false,
    username: '',
    email: '',
    token: '',
    mobile: '',
    spotLength: 0,
  },
};

interface SaveUserPayload {
  data: Partial<UserState>;
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<SaveUserPayload>) => {
      console.log('redux', state, 'action', action.payload);
      const { data } = action.payload;
      return {
        ...state,
        value: { ...state.value, ...data },
      };
    },
  },
});

export const { saveUser } = userSlice.actions;
export default userSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     value: {
//         isLoggedIn: false,
//         username: '',
//         email: '',
//         token: '',
//         mobile: '',
//         spotLength: 0 
//     },
// }

// export const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         saveUser: (state, action) => {
//             console.log('redux', state, 'action', action.payload)
//             const { data } = action.payload;
//             return {
//                 ...state,
//                 value: { ...state.value, ...data }
//             };
//         },
//     },
// })

// export const { saveUser } = userSlice.actions

// export default userSlice.reducer
