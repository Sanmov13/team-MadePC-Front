import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  madePC: [],
  // price: {
  //   board: 0,
  //   processor: 0,
  //   cooler: 0,
  //   corpus: 0,
  //   hdd: 0,
  //   power: 0,
  //   ram: 0,
  //   ssd: 0,
  //   videocard: 0,
  // },
  savePrice: 0,
  loader: false,
};

export const fetchmadePC = createAsyncThunk(
  "fetch/madeComps",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3010/madeComps");
      const data = await res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updatemadePC = createAsyncThunk(
  "update/madePC",
  async ({comp}, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3010/madeComp/633d1a07f178f47f21274783`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ram: comp._id
        }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addmadePC = createAsyncThunk(
  "add/madePC",
  async (
    {
      name,
      price,
      image,
      ram,
      videocard,
      hardcard,
      ssd,
      processor,
      corpus,
      cooler,
      math,
    },
    thunkAPI
  ) => {
    try {
      const res = await fetch("http://localhost:3010/madeComp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          image,
          ram,
          videocard,
          hardcard,
          ssd,
          processor,
          corpus,
          cooler,
          math,
        }),
      });
      const data = res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const madePC = createSlice({
  name: "madePC",
  initialState,
  reducers: {
    price: (state, action)=>{
      state.price = action.payload
    },
    savePrice: (state, action) => {
      state.savePrice += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      ////////////////FETCH-madePC///////////////
      .addCase(fetchmadePC.fulfilled, (state, action) => {
        state.madePC = action.payload;
        state.loader = false;
      })
      .addCase(fetchmadePC.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(fetchmadePC.rejected, (state, action) => {
        state.loader = false;
      })
      ///////////////UPDATE-madePC//////////////
      .addCase(updatemadePC.fulfilled, (state, action) => {
        state.madePC = action.payload;
        state.loader = false;
      })
      .addCase(updatemadePC.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(updatemadePC.rejected, (state, action) => {
        state.loader = false;
      })
      ///////////////ADD-madePC//////////////
      .addCase(addmadePC.fulfilled, (state, action) => {
        state.madePC.push(action.payload);
        state.loader = false;
      })
      .addCase(addmadePC.pending, (state, action) => {
        state.loader = true;
      })
      .addCase(addmadePC.rejected, (state, action) => {
        state.loader = false;
      });
  },
});

export default madePC.reducer;

export const { price } = madePC.actions;
export const { savePrice } = madePC.actions;
