export const getInitials = (text = "") =>
    text
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase())
        .join("");

export const getFirstLetter = (text = "") =>
    text.trim().charAt(0).toUpperCase();

// Get avater color(Random)
export const getAvatarRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;


// Get avater color(Consistent)
export const getAvatarColor = (id = "") => {
    const colors = [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#009688",
        "#4CAF50",
        "#FF9800",
        "#795548",
    ];

    let hash = 0;

    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

// Remove underscore from text
export const formatText = (text = "") =>
    text
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());