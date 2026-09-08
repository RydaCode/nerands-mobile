export const generateCartId = (
    product_id,
    variants = [],
    extras = []
) => {
    /*
     * Variants:
     *
     * [
     *   {
     *     group_id: "...",
     *     options: [
     *       {
     *         option_id: "..."
     *       }
     *     ]
     *   }
     * ]
     */

    const variantPart = Array.isArray(variants)
        ? variants
            .flatMap(group =>
                Array.isArray(group?.options)
                    ? group.options.map(
                        option => option?.option_id
                    )
                    : []
            )
            .filter(Boolean)
            .sort()
            .join("_")
        : "";

    /*
     * Extras are kept for backwards compatibility.
     * Since extras are now represented as variant groups,
     * this can normally be an empty array.
     */

    const extrasPart = Array.isArray(extras)
        ? extras
            .map(extra =>
                typeof extra === "string"
                    ? extra
                    : extra?.extra_id ??
                      extra?.option_id
            )
            .filter(Boolean)
            .sort()
            .join("_")
        : "";

    return `${product_id}|${variantPart}|${extrasPart}`;
};