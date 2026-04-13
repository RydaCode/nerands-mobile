import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateRunnerLocation = async (runnerId, lat, lng) => {
    await setDoc(
        doc(db, 'runners', runnerId),
        {
            lat,
            lng,
            updatedAt: serverTimestamp()
        },
        { merge: true } // merges with existing data
    );
};
