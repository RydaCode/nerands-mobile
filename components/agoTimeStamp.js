import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const agoTimeStamp = (date) => {
    if (!date) return "";

    const d = dayjs(date);

    if (!d.isValid()) return "";

    return d.fromNow();
};

export default agoTimeStamp;