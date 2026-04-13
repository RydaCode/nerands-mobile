import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyALzQqpPLv4K8IEITwZ0iNTgBwZ2q_pA7I",              // from client[0].api_key[0].current_key
    authDomain: "nerands-c973f.firebaseapp.com",  // project_info.project_id + ".firebaseapp.com"
    projectId: "nerands-c973f",         // project_info.project_id
    storageBucket: "nerands-c973f.appspot.com",   // project_info.storage_bucket
    messagingSenderId: "226757064298",   // project_info.project_number
    appId: "1:226757064298:android:12c390ddf901b357a23c13"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);