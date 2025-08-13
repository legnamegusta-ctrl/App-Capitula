// public/js/modules/firebase.js

const firebaseConfig = {
    apiKey: "AIzaSyDeIcQF_KjG2ee61NUH7nL7gvuq73JAXF0",
    authDomain: "capitula-livros.firebaseapp.com",
    projectId: "capitula-livros",
    storageBucket: "capitula-livros.firebasestorage.app",
    messagingSenderId: "276926251332",
    appId: "1:276926251332:web:720779befbc507721a9711"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };