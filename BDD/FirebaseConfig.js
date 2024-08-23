// Importa los m�dulos de Firebase desde el CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Configuraci�n de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvQZSnZzVR-6HpMX09PYZQZyr4q3vLUlc",
  authDomain: "aaaa-2bd66.firebaseapp.com",
  projectId: "aaaa-2bd66",
  storageBucket: "aaaa-2bd66.appspot.com",
  messagingSenderId: "722646702326",
  appId: "1:722646702326:web:c74730bbb564ab0b86f4d7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Usa los servicios de Firebase
const auth = getAuth(app);
const firestore = getFirestore(app);

console.log('Firebase initialized', { auth, firestore });
export { auth, firestore };