
// Product total after base price + variants + extras
export const calculateUnitPrice = (item) => {
    const variants = Object.values(item.selected_variants || {});

    const variantPrice = variants.length
        ? variants.reduce((s, v) => s + (v.price || 0), 0)
        : item.final_price;

    const extrasMap = new Map(
        (item.product_extras || []).map(e => [e.extra_id, e])
    );

    const extrasTotal = (item.selected_extras || []).reduce(
        (s, id) => s + (extrasMap.get(id)?.extra_price || 0),
        0
    );

    return variantPrice + extrasTotal;
};

// Product total after base price + variants + extras + quantity
export const calculateItemTotal = (item) => {
    const unitPrice = calculateUnitPrice(item);
    return unitPrice * item.product_qty;
};

// Cart total
export const calculateCartTotal = (cartItems) => {
    return cartItems.reduce((sum, item) => {
        return sum + calculateItemTotal(item);
    }, 0);
};