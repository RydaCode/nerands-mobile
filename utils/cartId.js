export const generateCartId = (product_id, variants, extras) => {
    const variantPart = Object.values(variants)
        .map(v => v?.id)
        .filter(Boolean)
        .sort()
        .join("_");

    const extrasPart = extras.join("_");

    return `${product_id}|${variantPart}|${extrasPart}`;
};