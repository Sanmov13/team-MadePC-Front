import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
  users: [],
  error: null,
  load: false,
  token: localStorage.getItem("token"),
  id: localStorage.getItem("id"),
};

export const fetchUsers = createAsyncThunk(
  "fetch/users",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3010/users");
      const data = await res.json();

      return data;
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const authThunk = createAsyncThunk(
  "fetch/auth",
  async ({ reglogin, regPassword }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3010/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: reglogin, password: regPassword }),
      });
      const token = await res.json();

      return token;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "fetch/login",
  async ({ login, password }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3010/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });
      const token = await res.json();
      if (token.error) {
        return thunkAPI.rejectWithValue(token.error);
      }
      localStorage.setItem("token", token.token);
      localStorage.setItem("id", token.login1);

      return token;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const addToBasket = createAsyncThunk(
  "add/basket",
  async ({ id1, computersId }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3010/addToBasket/${id1}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          basket: computersId
        }),
      });

      const data = await res.json();
      return { id1, computersId };
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const deleteFromBasket = createAsyncThunk(
  "delete/basket",
  async ({ id, result1 }, thunkAPI) => {
    console.log(result1);
    try {
      const res = await fetch(`http://localhost:3010/deleteFromBasket/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ basket: result1 }),
      });

      const data = await res.json();
      return { id, result1 };
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const countPlus = createAsyncThunk(
  "count/plus",
  async ({ itemId, id, price }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3010/countPlus/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price }),
      });

      const data = await res.json();
      return { itemId, id, price };
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

export const countMinus = createAsyncThunk(
  "count/minus",
  async ({ itemId, id }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3010/countMinus/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      return { itemId, id };
    } catch (e) {
      thunkAPI.rejectWithValue(e);
    }
  }
);

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authThunk.pending, (state, action) => {
        state.load = true;
      })
      .addCase(authThunk.fulfilled, (state, action) => {
        state.load = false;
      })
      .addCase(loginThunk.pending, (state, action) => {
        state.load = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.load = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.load = false;
        state.error = null;
        state.token = action.payload.token;
        state.id = action.payload.login1;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.load = false;
      })
      .addCase(addToBasket.fulfilled, (state, action) => {
        state.users = state.users.map((item) => {
          if (item._id === action.payload.id1) {
            item.basket.push(action.payload.computersId);
          }
          return item;
        });
        state.load = false;
      })
      .addCase(deleteFromBasket.fulfilled, (state, action) => {
        state.users = state.users.map((item) => {
          if (item._id === action.payload.id) {
            return {
              ...item,
              basket: item.basket.filter((item) => {
                return item._id !== action.payload.result1;
              }),
            };
          }
          return item;
        });
      })
      .addCase(countPlus.fulfilled, (state, action) => {
        state.users.map((item) => {
          if (item._id === action.payload.id) {
            return item.basket.map((i) => {
              if (i._id === action.payload.itemId) {
                i.count += 1;
                i.price = i.price + i.total;
              }
              return i;
            });
          }
          return item;
        });
      })
      .addCase(countMinus.fulfilled, (state, action) => {
        state.users.map((item) => {
          if (item._id === action.payload.id) {
            return item.basket.map((i) => {
              if (i._id === action.payload.itemId) {
                i.count -= 1;
                i.price = i.price - i.total;
              }
              return i;
            });
          }
          return item;
        });
      });
  },
});

export default applicationSlice.reducer;
