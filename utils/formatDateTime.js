export const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
        timeZone: "Africa/Lusaka",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("en-GB", {
        timeZone: "Africa/Lusaka",
        hour: "2-digit",
        minute: "2-digit",
    });