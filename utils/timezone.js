export const getUserTimezone = () => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (timezone) {
            return timezone;
        }
    } catch (e) {
        console.warn("Unable to detect timezone", e);
    }
    return null;
};