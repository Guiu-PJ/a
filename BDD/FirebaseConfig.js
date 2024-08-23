const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

// Configuración de Firebase
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

export { auth, firestore };