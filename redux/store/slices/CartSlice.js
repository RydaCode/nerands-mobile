import { createSlice } from "@reduxjs/toolkit";
import { generateCartId } from "../../../utils/cartId";

const initialState = {
    cartItems: [],
    store_id: null,
    business_id: null,
    modalVisible: false,
    quantity: 1,
};

// Normalize helpers
const normalizeVariants = (variants = {}) => {
    const sorted = {};

    if (!variants || typeof variants !== "object" || Array.isArray(variants)) {
        return {};
    }

    Object.keys(variants)
        .sort()
        .forEach((key) => {
            const v = variants[key];

            if (v && typeof v === "object" && !Array.isArray(v)) {
                sorted[key] = {
                    id: v.id ?? null,
                    name: v.name ?? "",
                    price: v.price ?? 0,
                };
            } else {
                sorted[key] = null;
            }
        });
    return sorted;
};

const normalizeExtras = (extras = []) => {
    return [...extras]
        .map(e =>
            typeof e === "string"
                ? e
                : e?.extra_id
        )
        .filter(Boolean)
        .sort();
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const {
                store_id,
                business_id,
                store_name,
                product_id,
                product_name,
                store_category,
                product_images,
                store_latitude,
                store_longitude,
                variant_groups = [],
                product_extras = [],
                product_extras_status = false,
                selected_variants = {},
                selected_extras = [],
                product_price = 0,
                final_price = 0,
                product_qty = 1,
                product_notes = "",
                store_phone_num,
            } = action.payload;

            // 🔴 BLOCK MIXED STORES INSIDE REDUX
            if (state.cartItems.length > 0 && state.store_id !== store_id) {
                return; // ❌ reject silently OR handle with UI alert before dispatch
            }

            state.store_id = store_id; // ✅ set active store

            const normalizedVariants = normalizeVariants(selected_variants);
            const normalizedExtras = normalizeExtras(selected_extras);

            const cart_id = generateCartId(
                product_id,
                normalizedVariants,
                normalizedExtras
            );

            const existing = state.cartItems.find(i => i.cart_id === cart_id);

            if (existing) {
                existing.product_qty += product_qty;
                existing.total_price = existing.product_qty * existing.final_price;
            } else {
                state.cartItems.push({
                    cart_id,
                    store_id,
                    business_id,
                    store_name,
                    product_id,
                    product_name,
                    store_category,
                    product_images,
                    store_latitude,
                    store_longitude,
                    variant_groups,
                    product_extras,
                    product_extras_status ,
                    selected_variants: selected_variants,
                    selected_extras: selected_extras,
                    product_price,
                    final_price,
                    product_qty,
                    product_notes,
                    store_phone_num,
                    total_price: final_price * product_qty,
                });
            }
        },

        updateItem: (state, action) => {
            const {
                cart_id,
                store_id,
                business_id,
                product_qty,
                selected_variants,
                selected_extras,
                product_price,
                final_price,
                product_notes,
            } = action.payload;

            // 🚨 block different store updates
            if (state.store_id && state.store_id !== store_id) return;

            const index = state.cartItems.findIndex(
                item => item.cart_id === cart_id
            );

            if (index === -1) return;

            const item = state.cartItems[index];

            state.cartItems[index] = {
                ...item,
                selected_variants: selected_variants
                    ? normalizeVariants(selected_variants)
                    : item.selected_variants,

                selected_extras: selected_extras
                    ? normalizeExtras(selected_extras)
                    : item.selected_extras,

                product_price: product_price ?? item.product_price,
                final_price: final_price ?? item.final_price,
                product_qty: product_qty ?? item.product_qty,
                product_notes: product_notes ?? item.product_notes,

                total_price:
                    (final_price ?? item.final_price) *
                    (product_qty ?? item.product_qty),
            };
        },

        increaseQty: (state, action) => {
            const item = state.cartItems.find(
                (i) => i.cart_id === action.payload
            );

            if (item) {
                item.product_qty += 1;
                item.total_price =
                    item.product_qty * item.final_price;
            }
        },

        decreaseQty: (state, action) => {
            const item = state.cartItems.find(
                (i) => i.cart_id === action.payload
            );

            if (item && item.product_qty > 1) {
                item.product_qty -= 1;
                item.total_price =
                    item.product_qty * item.final_price;
            }
        },

        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(
                item => item.cart_id !== action.payload
            );

            // reset store if cart is empty
            if (state.cartItems.length === 0) {
                state.store_id = null;
            }
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.store_id = null; // 🔥 reset store
        },
    },
});

export const {
    addItem,
    updateItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;