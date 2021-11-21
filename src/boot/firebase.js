import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Agregar configuración firebase:
const firebaseConfig = {
    apiKey: "AIzaSyBR-Lgm_WQm1Ajx2s0Avn4bnVmW9vll5sI",
    authDomain: "proyecto-01-up.firebaseapp.com",
    projectId: "proyecto-01-up",
    storageBucket: "proyecto-01-up.appspot.com",
    messagingSenderId: "745897043509",
    appId: "1:745897043509:web:bbf030104921e691ac737c"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();


export { db, firebase };