import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the state
interface TransferDataState {
  value: Record<string, any>; // You can replace `any` with a stricter type if known
}

// Define action payload types
interface UpdateTransferInputPayload {
  name: string;
  value: any;
}

interface TransferSubmitPayload {
  data: Record<string, any>;
}

// Initial state
const initialState: TransferDataState = {
  value: {},
};

export const dataTransfer = createSlice({
  name: 'transferData',
  initialState,
  reducers: {
    updateTransferInput: (state, action: PayloadAction<UpdateTransferInputPayload>) => {
      const { name, value } = action.payload;
      state.value[name] = value;
    },
    transferSubmit: (state, action: PayloadAction<TransferSubmitPayload>) => {
      const { data } = action.payload;
      state.value = { ...state.value, ...data };
    },
  },
});

export const { transferSubmit, updateTransferInput } = dataTransfer.actions;

export default dataTransfer.reducer;


// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     value: [],
// }

// export const dataTransfer = createSlice({
//     name: 'transferData',
//     initialState,
//     reducers: {
//         updateTransferInput: (state, action) => {
//             const { name, value } = action.payload;
//             state.value[name] = value;
//         },
//         transferSubmit: (state, action) => {
//             const { data } = action.payload;
//             state.value = { ...state.value, ...data };
//         },
//     },
// })

// export const { transferSubmit, updateTransferInput } = dataTransfer.actions

// export default dataTransfer.reducer
