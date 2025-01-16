import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
    const { data } = await axios.get('/comments');
    return data;
  });

const commentsSlice = createSlice({
    name: 'comments',
    initialState: { items: [], status: 'loading' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchComments.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const commentsReducer = commentsSlice.reducer;
