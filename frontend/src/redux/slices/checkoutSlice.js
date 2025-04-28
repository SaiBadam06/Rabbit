import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get auth config
const getAuthConfig = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
        throw new Error("Authentication required");
    }
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
};

// Async Thunk to create a checkout session
export const createCheckout = createAsyncThunk(
    'checkout/create',
    async (checkoutData, { rejectWithValue }) => {
        try {
            if (!checkoutData) {
                throw new Error("Checkout data is required");
            }

            const config = getAuthConfig();
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutData,
                config
            );

            if (response.data?.url) {
                window.location.href = response.data.url;
            }
            
            return response.data;
        } catch (error) {
            if (error.message === "Authentication required") {
                return rejectWithValue({ message: "Please login to checkout" });
            }
            if (error.message === "Checkout data is required") {
                return rejectWithValue({ message: "Invalid checkout data" });
            }
            if (!error.response) {
                return rejectWithValue({ message: "Network error. Please check your connection." });
            }
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to create checkout session'
            });
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkoutSession: null,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        clearCheckoutError: (state) => {
            state.error = null;
        },
        resetCheckout: (state) => {
            state.checkoutSession = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.checkoutSession = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkoutSession = action.payload;
                state.success = true;
                state.error = null;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Checkout failed';
                state.success = false;
                state.checkoutSession = null;
            });
    },
});

export const { clearCheckoutError, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;

