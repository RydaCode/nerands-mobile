import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [], // ✅ Initialize cart items
    modalVisible: false,
    quantity: 1,
    selectedExtras: [], 
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const existingIndex = state.cartItems.findIndex(
                item =>
                    item.product_id === action.payload.product_id &&
                    JSON.stringify(item.selected_extras) === JSON.stringify(action.payload.selected_extras)
            );

            if (existingIndex >= 0) {
                state.cartItems[existingIndex].product_qty += action.payload.product_qty;
                state.cartItems[existingIndex].total_price += 
                    (action.payload.product_price || 0) * action.payload.product_qty;
            } else {
                state.cartItems.push(action.payload);
            }
        },
        increaseQty: (state, action) => {
            const item = state.cartItems.find(item => item.product_id === action.payload);
            if (item) {
                const unitPrice = item.total_price / item.product_qty;
                item.product_qty += 1;
                item.total_price += unitPrice;
            }
        },
        decreaseQty: (state, action) => {
            const itemIndex = state.cartItems.findIndex(item => item.product_id === action.payload);
            if (itemIndex >= 0) {
                const item = state.cartItems[itemIndex];
                if (item.product_qty > 1) {
                    const unitPrice = item.total_price / item.product_qty;
                    item.product_qty -= 1;
                    item.total_price -= unitPrice;
                } else {
                    state.cartItems.splice(itemIndex, 1);
                }
            }
        },
        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.product_id !== action.payload);
        },
        clearCart: (state) => {
            state.cartItems = []; // ✅ Corrected
        },
        updateExtras: (state, action) => {
            const { product_id, selected_extras } = action.payload;
            const item = state.cartItems.find(cart => cart.product_id === product_id);
            if (item) {
                item.selected_extras = selected_extras || [];
                const extrasTotal = item.selected_extras.reduce((sum, extra) => sum + (extra?.price || 0), 0);
                item.total_price = (item.product_price + extrasTotal) * item.product_qty;
                
                // ✅ Ensure state updates correctly
                state.cartItems = [...state.cartItems]; 
            }
        }
    }
});

export const { addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    updateExtras
} = cartSlice.actions;
export default cartSlice.reducer;