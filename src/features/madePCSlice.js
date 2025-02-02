import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  madePC: [],
  savePrice: 0,
  corpus:null,
  pc: [],
  loader: false,
  id: null,
  comp: localStorage.getItem("comp"),
  corpusImg:null,
  cooler:"Охлаждение",
  mainBoard:"Материнская плата",
  ram:"Оперативная память",
  proc:"Процесор",
  hdd: "Жесткий диск",
  corpus:"Корпус",
  power:"Блок Питания",
  ssd:"SSD",
  videocard:"Видеокарта"
  
};

export const fetchmadePC = createAsyncThunk(
  "fetch/madeComps",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3010/madeComps");
      const data = await res.json();
      localStorage.setItem("comp", data[data.length - 1]._id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString());
    }
  }
);

export const updateOne = createAsyncThunk(
  "updateOne/MadePC",
  async ({id}, thunkAPI) => {
    try {
      const res = fetch(`http://localhost:3010/madeComp/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });
      const data = res.json();
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOnePC = createAsyncThunk("get/onePC", async (_, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:3010/oneMPC");
    return res.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updatemadePC = createAsyncThunk(
  "update/madePC",
  async (
    {
      ram,
      videocard,
      hardcard,
      ssd,
      processor,
      corpus,
      cooler,
      math,
      powerunits,
    },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`http://localhost:3010/mPC`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: 0,
          ram,
          videocard,
          hardcard,
          ssd,
          processor,
          corpus,
          cooler,
          math,
          powerunits,
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
    price: (state, action) => {
      state.price = action.payload;
    },
    savePrice: (state, action) => {
      state.savePrice += action.payload;
    },
    saveCorpusImg: (state,action)=>{
      state.corpusImg = action.payload
    },
    saveRam: (state,action)=>{
      state.ram = action.payload
    },
    saveBoard: (state,action)=>{
      state.mainBoard = action.payload
    },
    saveCooler: (state,action)=>{
      state.cooler = action.payload
    },
    saveProc: (state,action)=>{
      state.proc = action.payload
    },
    saveHdd: (state,action)=>{
      state.hdd = action.payload
    },
    savepower: (state,action)=>{
      state.power = action.payload
    },
    savessd: (state,action)=>{
      state.ssd = action.payload
    },
    saveVideoCard: (state,action)=>{
      state.videocard = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      ////////////////FETCH-madePC///////////////
      .addCase(fetchmadePC.fulfilled, (state, action) => {
        state.madePC = action.payload;
        state.loader = false;
        state.comp = action.payload[action.payload.length -1]._id
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
      })

      .addCase(getOnePC.fulfilled, (state, action) => {
        state.id = action.payload._id;
      });
  },
});

export default madePC.reducer;

export const { price,saveCorpusImg,saveBoard,saveCooler,saveProc,saveRam,saveHdd,saveVideoCard,savessd,savepower } = madePC.actions;
export const { savePrice } = madePC.actions;
