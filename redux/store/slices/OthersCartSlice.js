import { createSlice } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";

const initialState = {
    othersCartItems: [],
    modalVisible: false,
    quantity: 1,
};

const normalizeVariants = (variants = {}) => {
    const sorted = {};

    Object.keys(variants).forEach((key) => {
        const group = variants[key];

        sorted[key] = {
            ...group,
            options: [...(group?.options || [])].sort(
                (a, b) => a.id - b.id
            ),
        };
    });

    return sorted;
};

const othersCartSlice = createSlice({
    name: "otherscart",
    initialState,
    reducers: {
        addOthersItem: (state, action) => {
            const {
                product_id,
                selected_variants = {},
                variant_groups = {},
                product_price = 0,
                final_price = 0,
                product_qty = 1,
                product_notes = ""
            } = action.payload;

            const normalizedNew = normalizeVariants(selected_variants);

            const existingIndex = state.othersCartItems.findIndex((item) =>
                item.product_id === product_id &&
                isEqual(item.selected_variants, normalizedNew)
            );

            if (existingIndex >= 0) {
                const existing = state.othersCartItems[existingIndex];

                existing.product_qty += product_qty;
                existing.total_price =
                    existing.product_qty * existing.final_price;

            } else {
                state.othersCartItems.push({
                    ...action.payload,
                    selected_variants: normalizedNew,
                    total_price: final_price * product_qty,
                });
            }
        },

        updateOthersItem: (state, action) => {
            const {
                product_id,
                selected_variants = {},
                product_price,
                final_price,
                product_qty,
                product_notes = ""
            } = action.payload;

            const index = state.othersCartItems.findIndex(
                (item) => item.product_id === product_id
            );

            if (index !== -1) {
                state.othersCartItems[index] = {
                    ...state.othersCartItems[index],
                    selected_variants: normalizeVariants(selected_variants),
                    product_qty,
                    product_price,
                    total_price: final_price * product_qty,
                    product_notes,
                };
            }
        },

        increaseOthersQty: (state, action) => {
            const item = state.othersCartItems.find(
                (i) => i.product_id === action.payload
            );

            if (item) {
                item.product_qty += 1;
                item.total_price =
                    item.product_qty * item.final_price;
            }
        },

        decreaseOthersQty: (state, action) => {
            const item = state.othersCartItems.find(
                (i) => i.product_id === action.payload
            );

            if (item && item.product_qty > 1) {
                item.product_qty -= 1;
                item.total_price =
                    item.product_qty * item.final_price;
            }
        },

        removeOthersItem: (state, action) => {
            state.othersCartItems = state.othersCartItems.filter(
                (item) => item.product_id !== action.payload
            );
        },

        clearOthersCart: (state) => {
            state.othersCartItems = [];
        },
    },
});

export const {
    addOthersItem,
    updateOthersItem,
    increaseOthersQty,
    decreaseOthersQty,
    removeOthersItem,
    clearOthersCart
} = othersCartSlice.actions;

export default othersCartSlice.reducer;