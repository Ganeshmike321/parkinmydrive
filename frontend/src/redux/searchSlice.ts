import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  from: string;
  to: string;
  selectedFromTime: string;
  selectedToTime: string;
  event: string;
  destination: string;
  vehicle_type: string;
  lat: string;
  lng: string;
  error: Record<string, string>; // Or more specific typing if you know the error structure
}

interface UpdateSearchInputPayload {
  name: keyof SearchState;
  value: string;
}

interface SearchSubmitPayload {
  data: Partial<SearchState>;
}

interface RootState {
  value: SearchState;
}

const initialState: RootState = {
  value: {
    from: '',
    to: '',
    selectedFromTime: '',
    selectedToTime: '',
    event: '',
    destination: '',
    vehicle_type: '',
    lat: '',
    lng: '',
    error: {},
  },
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateSearchInput: (state, action: PayloadAction<UpdateSearchInputPayload>) => {
      const { name, value } = action.payload;
      if (name === "error") {
        state.value.error = value as any; // or handle as needed
      } else {
        (state.value as any)[name] = value;
      }
    },
    searchSubmit: (state, action: PayloadAction<SearchSubmitPayload>) => {
      const { data } = action.payload;
      state.value = { ...state.value, ...data };
    },
  },
});

export const { searchSubmit, updateSearchInput } = searchSlice.actions;

export default searchSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//     value: {
//         from: "",
//         to: "",
//         selectedFromTime: "",
//         selectedToTime: "",
//         event: "",
//         destination: "",
//         vehicle_type: "",
//         lat: "", lng: "",
//         error: {}
//     },
// }

// export const searchSlice = createSlice({
//     name: 'search',
//     initialState,
//     reducers: {
//         updateSearchInput: (state, action) => {
//             const { name, value } = action.payload;
//             state.value[name] = value;
//         },
//         searchSubmit: (state, action) => {
//             const { data } = action.payload;
//             state.value = { ...state.value, ...data };
//         },
//     },
// })

// export const { searchSubmit, updateSearchInput } = searchSlice.actions

// export default searchSlice.reducer
