import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    custom_stores: [],
    runner_details: null,
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {

        addProduct: (state, action) => {
            const {
                name,
                estimatedPrice,
                qty,
                productNotes,
            } = action.payload;

            state.products.push({
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                name,
                estimatedPrice: estimatedPrice || null,
                qty: qty || 1,
                productNotes: productNotes || "",
                createdAt: new Date().toISOString(),
            });
        },

        addStore: (state, action) => {
            if (typeof action.payload !== "string") return;

            const store = action.payload.trim();

            if (!store) return;

            const exists = state.custom_stores.some(
                item => item.name.toLowerCase() === store.toLowerCase()
            );

            if (exists) return;

            state.custom_stores.push({
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                name: store,
            });
        },

        addRunner: (state, action) => {
            const runner = action.payload;

            if (!runner || typeof runner !== "object") return;

            if (!runner.runner_id) return;

            // automatically replace existing runner
            state.runner_details = runner;
        },

        updateProduct: (state, action) => {
            const { id, updates } = action.payload;

            const productIndex = state.products.findIndex(
                item => item.id === id
            );

            if (productIndex !== -1) {
                state.products[productIndex] = {
                    ...state.products[productIndex],
                    ...updates,
                };
            }
        },

        deleteProduct: (state, action) => {
            state.products = state.products.filter(
                item => item.id !== action.payload
            );
        },

        removeStore: (state, action) => {
            state.custom_stores = state.custom_stores.filter(
                store => store.id !== action.payload
            );
        },

        clearStores: (state) => {
            state.custom_stores = [];
        },

        clearProducts: (state) => {
            state.products = [];
        },

        clearRunner: (state) => {
            state.runner_details = null;
        },
    },
});

export const {
    addProduct,
    updateProduct,
    deleteProduct,
    clearProducts,
    addStore,
    clearStores,
    removeStore,
    addRunner,
    clearRunner
} = productSlice.actions;

export default productSlice.reducer;