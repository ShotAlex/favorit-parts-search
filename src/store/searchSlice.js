import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchGoods } from '../services/favoritApi';

export const searchBrands = createAsyncThunk(
  'search/brands',
  async (number, { rejectWithValue }) => {
    try {
      return { number, goods: await fetchGoods({ number }) };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const searchOffers = createAsyncThunk(
  'search/offers',
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      return { brand, goods: await fetchGoods({ number, brand }) };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  number: '',
  brands: [],
  offers: [],
  selectedBrand: null,
  brandsStatus: 'idle',
  offersStatus: 'idle',
  brandsError: null,
  offersError: null,
  hasSearched: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setNumber(state, action) {
      state.number = action.payload;
    },
    resetSearch() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchBrands.pending, state => {
        state.brandsStatus = 'loading';
        state.brandsError = null;
        state.offers = [];
        state.selectedBrand = null;
        state.offersStatus = 'idle';
        state.hasSearched = true;
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.brandsStatus = 'succeeded';
        state.brands = action.payload.goods.filter(good => good?.brand && good?.number);
      })
      .addCase(searchBrands.rejected, (state, action) => {
        state.brandsStatus = 'failed';
        state.brands = [];
        state.brandsError = action.payload || action.error.message;
      })
      .addCase(searchOffers.pending, (state, action) => {
        state.offersStatus = 'loading';
        state.offersError = null;
        state.selectedBrand = action.meta.arg.brand;
        state.offers = [];
      })
      .addCase(searchOffers.fulfilled, (state, action) => {
        state.offersStatus = 'succeeded';
        state.selectedBrand = action.payload.brand;
        state.offers = action.payload.goods;
      })
      .addCase(searchOffers.rejected, (state, action) => {
        state.offersStatus = 'failed';
        state.offersError = action.payload || action.error.message;
      });
  },
});

export const { setNumber, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
