import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

// Helper function to load cart items from localStorage
const localCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
};

//Helper function to save cart items to localStorage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

//Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async ({userId, guestId}, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/cart`,
                {
                    params: { userId, guestId }
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response.data);
        }
    }
);

//add item to cart for a user or guest
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({productId, quantity, size, color, guestId, userId}, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/cart`,
                { 
                    productId, 
                    quantity, 
                    size, 
                    color, 
                    guestId, 
                    userId, 
                },
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ productId, quantity, guestId, userId, size, color }) => {
        try {
            const response = await axios.put(`${API_URL}/api/cart`, {
                productId,
                quantity,
                guestId,
                userId,
                size,
                color
            });
            return response.data;
        } catch (error) {
            console.error("Error updating cart:", error);
            throw error;
        }
    }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
    "cart/removeItem",
    async ({ productId, guestId, userId, size, color }) => {
        try {
            const response = await axios.delete(`${API_URL}/api/cart`, {
                data: { productId, guestId, userId, size, color }
            });
            return response.data;
        } catch (error) {
            console.error("Error removing from cart:", error);
            throw error;
        }
    }
);

//Merege guest cart with user cart
export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async ({ guestCartItems }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/cart/merge`,
                { guestCartItems },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to merge cart" }
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: localCartFromStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] };
            localStorage.removeItem("cart");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add to cart";
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update item quantity";
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item";
            })
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart";
            })
        },
});

export const { clearCart } = cartSlice.actions;
export  default cartSlice.reducer;
