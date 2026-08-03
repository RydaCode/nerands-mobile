export const getStoreStatus = (item) => {
    const total = Number(item.store_total);
    const accepted = Number(item.store_accepted);
    const ready = Number(item.store_ready);
    const processing = Number(item.store_processing);
    const completed = Number(item.store_completed);

    if (ready === total) {
        return `All ${total} stores ready`;
    }

    if (processing > 0) {
        return `${processing}/${total} store${total > 1 ? 's' : ''} processing`;
    }

    if (accepted > 0) {
        return `${accepted}/${total} stores accepted`;
    }

    if (completed === total) {
        return 'All stores completed';
    }

    return `${ready}/${total} stores ready`;
};

export const getStoreStatusColor = (item) => {
    const total = Number(item.store_total);
    const ready = Number(item.store_ready);
    const accepted = Number(item.store_accepted);
    const processing = Number(item.store_processing);

    if (ready === total && total > 0) {
        return '#10B981'; // green - all ready
    }

    if (accepted > 0) {
        return '#22C55E'; // coral - accepted
    }

    if (processing > 0) {
        return '#3B82F6'; // blue - processing
    }

    if (ready > 0) {
        return '#F59E0B'; // orange - partially ready
    }

    return 'red'; // red - waiting
};