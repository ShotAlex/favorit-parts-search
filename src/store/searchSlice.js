import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.favorit-parts.ru/hs/hsprice/';
const DEMO_KEY = '00000000-0000-0000-0000-000000000001';

async function requestGoods({ number, brand }) {
  const url = new URL(API_URL);
  url.searchParams.set('key', import.meta.env.VITE_FAVORIT_API_KEY || DEMO_KEY);
  url.searchParams.set('number', number);
  url.searchParams.set('info', 'on');
  if (brand) {
    url.searchParams.set('brand', brand);
    url.searchParams.set('analogues', 'on');
  }
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch {
    throw new Error('Не удалось связаться с сервисом. Проверьте подключение и попробуйте ещё раз.');
  }
  if (!response.ok) throw new Error(`Сервис ответил с ошибкой (${response.status}). Попробуйте позже.`);
  let data;
  try { data = await response.json(); } catch { throw new Error('Сервис вернул некорректный ответ. Попробуйте позже.'); }
  if (data.error) throw new Error(Array.isArray(data.error) ? data.error.join(', ') : String(data.error));
  return Array.isArray(data.goods) ? data.goods : [];
}

export const searchBrands = createAsyncThunk('search/brands', async (number, { rejectWithValue }) => {
  try { return { number, goods: await requestGoods({ number }) }; }
  catch (error) { return rejectWithValue(error.message); }
});

export const searchOffers = createAsyncThunk('search/offers', async ({ number, brand }, { rejectWithValue }) => {
  try { return { brand, goods: await requestGoods({ number, brand }) }; }
  catch (error) { return rejectWithValue(error.message); }
});

const searchSlice = createSlice({
  name: 'search',
  initialState: { number: '', brands: [], offers: [], selectedBrand: null, brandsStatus: 'idle', offersStatus: 'idle', brandsError: null, offersError: null, hasSearched: false },
  reducers: {
    setNumber(state, action) { state.number = action.payload; },
    resetSearch(state) { Object.assign(state, searchSlice.getInitialState()); },
    clearOffers(state) { state.offers = []; state.selectedBrand = null; state.offersStatus = 'idle'; state.offersError = null; },
  },
  extraReducers(builder) {
    builder
      .addCase(searchBrands.pending, (state) => { state.brandsStatus = 'loading'; state.brandsError = null; state.offers = []; state.selectedBrand = null; state.offersStatus = 'idle'; state.hasSearched = true; })
      .addCase(searchBrands.fulfilled, (state, action) => { state.brandsStatus = 'succeeded'; state.brands = action.payload.goods.filter(g => g?.brand && g?.number); })
      .addCase(searchBrands.rejected, (state, action) => { state.brandsStatus = 'failed'; state.brands = []; state.brandsError = action.payload || action.error.message; })
      .addCase(searchOffers.pending, (state, action) => { state.offersStatus = 'loading'; state.offersError = null; state.selectedBrand = action.meta.arg.brand; state.offers = []; })
      .addCase(searchOffers.fulfilled, (state, action) => { state.offersStatus = 'succeeded'; state.selectedBrand = action.payload.brand; state.offers = action.payload.goods; })
      .addCase(searchOffers.rejected, (state, action) => { state.offersStatus = 'failed'; state.offersError = action.payload || action.error.message; });
  },
});

export const { setNumber, resetSearch, clearOffers } = searchSlice.actions;
export default searchSlice.reducer;
