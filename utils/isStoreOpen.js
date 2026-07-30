const convertToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return 0;

    const [hours, minutes] = timeStr.split(':').map(Number);

    return (hours * 60) + (minutes || 0);
};


const getLusakaNow = () => {
    const now = new Date();

    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lusaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(now);

    const hour = Number(parts.find(p => p.type === 'hour')?.value);
    const minute = Number(parts.find(p => p.type === 'minute')?.value);

    return hour * 60 + minute;
};

export const isStoreOpen = (openTime, closeTime) => {
  if (!openTime || !closeTime) return true;

  const currentMinutes = getLusakaNow();

  const openMinutes = convertToMinutes(openTime);
  const closeMinutes = convertToMinutes(closeTime);

  // normal same-day case
  if (closeMinutes > openMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  // overnight case (e.g. 20:00 - 02:00)
  return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
};

export const formatTime = (time) => {
    if (!time) return '';

    return time.slice(0, 5);
};