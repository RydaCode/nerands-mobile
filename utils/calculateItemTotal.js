// Product unit price
// ----------------------------------------------------
// No variant groups:
//     final_price
//
// Has variant groups:
//     sum of all selected variant option prices
//
// Extras:
//     selected extras are added to the variant/product price
// ----------------------------------------------------
export const calculateUnitPrice = (item) => {
    const variantGroups = item.variant_groups || [];

    /*
     * --------------------------------------------------
     * NO VARIANTS
     * --------------------------------------------------
     */
    const basePrice =
        variantGroups.length === 0
            ? Number(item.final_price) || 0
            : 0;

    /*
     * --------------------------------------------------
     * VARIANTS
     * --------------------------------------------------
     *
     * If the product has variants, use the prices of
     * the selected options.
     *
     * Required groups already have their first option
     * preselected, so their price is automatically
     * included.
     */
    const variantPrice =
        variantGroups.length > 0
            ? (item.selected_variants || [])
                .flatMap(group => group.options || [])
                .reduce(
                    (sum, option) =>
                        sum +
                        (Number(option.option_price) || 0),
                    0
                )
            : 0;

    /*
     * --------------------------------------------------
     * EXTRAS
     * --------------------------------------------------
     */

    const extrasMap = new Map(
        (item.product_extras || []).map(extra => [
            extra.extra_id,
            extra
        ])
    );

    const extrasTotal = (item.selected_extras || []).reduce(
        (sum, id) =>
            sum +
            (Number(extrasMap.get(id)?.extra_price) || 0),
        0
    );

    /*
     * --------------------------------------------------
     * FINAL UNIT PRICE
     * --------------------------------------------------
     */

    return basePrice + variantPrice + extrasTotal;
};


// Product total after quantity
export const calculateItemTotal = (item) => {
    const unitPrice = calculateUnitPrice(item);

    return unitPrice * (Number(item.product_qty) || 0);
};


// Cart total
export const calculateCartTotal = (cartItems) => {
    return cartItems.reduce(
        (sum, item) =>
            sum + calculateItemTotal(item),
        0
    );
};