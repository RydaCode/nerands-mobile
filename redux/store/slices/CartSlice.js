import { createSlice } from "@reduxjs/toolkit";
import { generateCartId } from "../../../utils/cartId";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    cartItems: [],
    store_id: null,
    business_id: null,
    modalVisible: false,
    quantity: 1,
};

/*
|--------------------------------------------------------------------------
| Normalize Selected Variants
|--------------------------------------------------------------------------
|
| Expected structure:
|
| [
|     {
|         group_id: "...",
|         group_name: "Size",
|         multi_select: false,
|         options: [
|             {
|                 option_id: "...",
|                 option_name: "Full Chicken",
|                 option_price: 80
|             }
|         ]
|     }
| ]
|
*/

const normalizeVariants = (variants = []) => {
    if (!Array.isArray(variants)) {
        return [];
    }

    return variants
        .map((group) => {
            if (!group || typeof group !== "object") {
                return null;
            }

            const options = Array.isArray(group.options)
                ? group.options
                    .map((option) => {
                        if (!option || typeof option !== "object") {
                            return null;
                        }

                        return {
                            option_id: option.option_id ?? option.id ?? null,
                            option_name:
                                option.option_name ??
                                option.name ??
                                "",
                            option_price:
                                Number(
                                    option.option_price ??
                                    option.price ??
                                    0
                                ) || 0,
                        };
                    })
                    .filter(Boolean)
                    .sort((a, b) =>
                        String(a.option_id).localeCompare(
                            String(b.option_id)
                        )
                    )
                : [];

            return {
                group_id: group.group_id ?? group.id ?? null,
                group_name:
                    group.group_name ??
                    group.name ??
                    "",
                multi_select:
                    group.multi_select ?? false,
                options,
            };
        })
        .filter(Boolean)
        .sort((a, b) =>
            String(a.group_id).localeCompare(
                String(b.group_id)
            )
        );
};

/*
|--------------------------------------------------------------------------
| Calculate Variant Price
|--------------------------------------------------------------------------
|
| Rules:
|
| No variants:
|     product final_price
|
| Has variants:
|     first group's selected option
|     = product/base price
|
|     options from all other groups
|     = additional prices
|
| Extras are now represented as variant groups,
| so they naturally participate here.
|
*/

const calculateVariantPrice = (
    finalPrice = 0,
    selectedVariants = []
) => {
    const variants = normalizeVariants(selectedVariants);

    /*
     * No variants
     */
    if (variants.length === 0) {
        return Number(finalPrice) || 0;
    }

    /*
     * First group is the price-defining group.
     *
     * Required groups are automatically given
     * their first option by ProductDetailsModal.
     */
    const firstGroup = variants[0];

    const firstGroupPrice = (firstGroup.options || []).reduce(
        (sum, option) =>
            sum + (Number(option.option_price) || 0),
        0
    );

    /*
     * Remaining groups are additions.
     */
    const additionalPrice = variants
        .slice(1)
        .reduce(
            (sum, group) =>
                sum +
                (group.options || []).reduce(
                    (groupSum, option) =>
                        groupSum +
                        (Number(option.option_price) || 0),
                    0
                ),
            0
        );

    return firstGroupPrice + additionalPrice;
};

/*
|--------------------------------------------------------------------------
| Cart Slice
|--------------------------------------------------------------------------
*/

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {
        /*
        |--------------------------------------------------------------------------
        | Add Item
        |--------------------------------------------------------------------------
        */

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
                selected_variants = [],
                product_price = 0,
                final_price = 0,
                product_qty = 1,
                product_notes = "",
                store_phone_num,
                store_image,
                store_description,
            } = action.payload;

            /*
             * Prevent mixed stores.
             */
            if (
                state.cartItems.length > 0 &&
                state.store_id !== store_id
            ) {
                return;
            }

            state.store_id = store_id;
            state.business_id = business_id;

            /*
             * Normalize variants before storing them.
             */
            const normalizedVariants =
                normalizeVariants(selected_variants);

            /*
             * Calculate the actual unit price.
             */
            const calculatedFinalPrice =
                calculateVariantPrice(
                    final_price,
                    normalizedVariants
                );

            /*
             * Generate a unique ID based on:
             *
             * product
             * + selected variant groups/options
             */
            const cart_id = generateCartId(
                product_id,
                normalizedVariants
            );

            /*
             * Check if exactly the same configuration
             * already exists in the cart.
             */
            const existing = state.cartItems.find(
                (item) => item.cart_id === cart_id
            );

            if (existing) {
                existing.product_qty +=
                    Number(product_qty) || 1;

                existing.total_price =
                    existing.product_qty *
                    existing.final_price;

                return;
            }

            /*
             * Add new cart item.
             */
            state.cartItems.push({
                cart_id,

                store_id,
                business_id,

                store_name,
                store_image,
                store_description,
                store_phone_num,

                store_category,

                store_latitude,
                store_longitude,

                product_id,
                product_name,
                product_images,

                product_price,

                /*
                 * This is the calculated unit price.
                 */
                final_price: calculatedFinalPrice,

                product_qty:
                    Number(product_qty) || 1,

                product_notes,

                variant_groups,

                selected_variants:
                    normalizedVariants,

                total_price:
                    calculatedFinalPrice *
                    (Number(product_qty) || 1),
            });
        },

        /*
        |--------------------------------------------------------------------------
        | Update Item
        |--------------------------------------------------------------------------
        */

        updateItem: (state, action) => {
            const {
                cart_id,
                store_id,
                business_id,
                product_qty,
                selected_variants,
                product_price,
                final_price,
                product_notes,
            } = action.payload;

            /*
             * Prevent updating an item from another store.
             */
            if (
                state.store_id &&
                state.store_id !== store_id
            ) {
                return;
            }

            const index =
                state.cartItems.findIndex(
                    (item) =>
                        item.cart_id === cart_id
                );

            if (index === -1) {
                return;
            }

            const item =
                state.cartItems[index];

            /*
             * Use new variants if supplied.
             */
            const normalizedVariants =
                selected_variants !== undefined
                    ? normalizeVariants(
                        selected_variants
                    )
                    : item.selected_variants;

            /*
             * Recalculate unit price.
             */
            const calculatedFinalPrice =
                selected_variants !== undefined
                    ? calculateVariantPrice(
                        final_price ??
                            item.product_price ??
                            item.final_price,
                        normalizedVariants
                    )
                    : (
                        final_price ??
                        item.final_price
                    );

            const quantity =
                product_qty ??
                item.product_qty;

            state.cartItems[index] = {
                ...item,

                business_id:
                    business_id ??
                    item.business_id,

                selected_variants:
                    normalizedVariants,

                product_price:
                    product_price ??
                    item.product_price,

                final_price:
                    calculatedFinalPrice,

                product_qty:
                    quantity,

                product_notes:
                    product_notes ??
                    item.product_notes,

                total_price:
                    calculatedFinalPrice *
                    quantity,
            };
        },

        /*
        |--------------------------------------------------------------------------
        | Increase Quantity
        |--------------------------------------------------------------------------
        */

        increaseQty: (state, action) => {
            const item =
                state.cartItems.find(
                    (item) =>
                        item.cart_id ===
                        action.payload
                );

            if (!item) {
                return;
            }

            item.product_qty += 1;

            item.total_price =
                item.product_qty *
                item.final_price;
        },

        /*
        |--------------------------------------------------------------------------
        | Decrease Quantity
        |--------------------------------------------------------------------------
        */

        decreaseQty: (state, action) => {
            const item =
                state.cartItems.find(
                    (item) =>
                        item.cart_id ===
                        action.payload
                );

            if (
                item &&
                item.product_qty > 1
            ) {
                item.product_qty -= 1;

                item.total_price =
                    item.product_qty *
                    item.final_price;
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Remove Item
        |--------------------------------------------------------------------------
        */

        removeItem: (state, action) => {
            state.cartItems =
                state.cartItems.filter(
                    (item) =>
                        item.cart_id !==
                        action.payload
                );

            if (
                state.cartItems.length === 0
            ) {
                state.store_id = null;
                state.business_id = null;
            }
        },

        /*
        |--------------------------------------------------------------------------
        | Clear Cart
        |--------------------------------------------------------------------------
        */

        clearCart: (state) => {
            state.cartItems = [];
            state.store_id = null;
            state.business_id = null;
        },
    },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
    addItem,
    updateItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;