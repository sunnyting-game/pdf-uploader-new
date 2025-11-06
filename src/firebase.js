import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5oDmnF2ZzGSEXxkjYznsnBUuSqCtp030",
  authDomain: "pdf-uploader-99dd6.firebaseapp.com",
  projectId: "pdf-uploader-99dd6",
  storageBucket: "pdf-uploader-99dd6.firebasestorage.app",
  messagingSenderId: "544088760035",
  appId: "1:544088760035:web:50b1dfaccc8d2db4bb2fd6"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);