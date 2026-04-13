import { createSlice } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual"; // ✅ For deep comparison

const initialState = {
    othersCartItems: [],
    modalVisible: false,
    quantity: 1,
};

const othersCartSlice = createSlice({
    name: "otherscart",
    initialState,
    reducers: {
        addOthersItem: (state, action) => {
            const { 
                product_id, 
                selected_colors = [], 
                selected_sizes = [], 
                available_colors = [], 
                available_sizes = [], 
                product_price = 0, 
                product_qty = 1 , 
                product_notes = ""
            } = action.payload;

            // ✅ Ensure colors & sizes are valid and sorted
            const validColors = selected_colors.filter(color => available_colors.includes(color)).sort();
            const validSizes = selected_sizes.filter(size => available_sizes.includes(size)).sort();

            // ✅ Check if the exact same product (with same colors & sizes) exists
            const existingIndex = state.othersCartItems.findIndex(
                item =>
                    item.product_id === product_id &&
                    isEqual(item.selected_colors, validColors) &&
                    isEqual(item.selected_sizes, validSizes)
            );

            if (existingIndex >= 0) {
                // ✅ Update quantity if product exists
                let existingItem = state.othersCartItems[existingIndex];
                existingItem.product_qty += product_qty;
                existingItem.total_price = existingItem.product_qty * product_price;
            } else {
                // ✅ Add new item with validated colors & sizes
                state.othersCartItems.push({
                    ...action.payload,
                    selected_colors: validColors,
                    selected_sizes: validSizes,
                    total_price: product_price * product_qty,
                });
            }
        },
        updateOthersItem: (state, action) => {
            const { 
                product_id, 
                selected_colors = [], 
                selected_sizes = [], 
                available_colors = [], 
                available_sizes = [], 
                product_price, 
                product_qty, 
                product_notes = ""
            } = action.payload;
        
            // ✅ Find existing item in the cart
            const existingIndex = state.othersCartItems.findIndex(item => item.product_id === product_id);
        
            if (existingIndex !== -1) {
                let existingItem = state.othersCartItems[existingIndex];
        
                // ✅ Validate colors & sizes - only keep those that are still available
                const validColors = existingItem.selected_colors.filter(color => available_colors.includes(color)).sort();
                const validSizes = existingItem.selected_sizes.filter(size => available_sizes.includes(size)).sort();
        
                // ✅ Update only necessary fields while keeping other details
                state.othersCartItems[existingIndex] = {
                    ...existingItem, // Preserve all existing details
                    selected_colors: selected_colors, // Use valid or new colors
                    selected_sizes: selected_sizes, // Use valid or new sizes
                    product_qty,
                    product_price,
                    total_price: product_price * product_qty,
                    product_notes, // ✅ Add the new product_notes field
                };
            }
        },                             
        increaseOthersQty: (state, action) => {
            const item = state.othersCartItems.find(i => i.product_id === action.payload);
            if (item) {
                item.product_qty += 1;
                item.total_price = item.product_qty * item.product_price;
            }
        },
        decreaseOthersQty: (state, action) => {
            const item = state.othersCartItems.find(i => i.product_id === action.payload);
            if (item && item.product_qty > 1) {
                item.product_qty -= 1;
                item.total_price = item.product_qty * item.product_price;
            }
        },
        removeOthersItem: (state, action) => {
            state.othersCartItems = state.othersCartItems.filter(item => item.product_id !== action.payload);
        },        
        clearOthersCart: (state) => {
            state.othersCartItems = [];
        },
    },
});

export const { 
    addOthersItem, 
    updateOthersItem, // ✅ Now correctly updates product details
    increaseOthersQty, 
    decreaseOthersQty, 
    removeOthersItem, 
    clearOthersCart
} = othersCartSlice.actions;

export default othersCartSlice.reducer;