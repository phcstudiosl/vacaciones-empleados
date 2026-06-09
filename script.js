import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getAuth,
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
getFirestore,
collection,
addDoc,
getDocs,
query,
where,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyCfsaoePqf5xWewNTBV6PmF5cNXWNUy-mk",
authDomain: "vacaciones-empleados.firebaseapp.com",
projectId: "vacaciones-empleados",
storageBucket: "vacaciones-empleados.firebasestorage.app",
messagingSenderId: "977710909114",
appId: "1:977710909114:web:9d2a0c63d67e2a0e60e483",
measurementId: "G-TNKLJR8W12"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const ADMIN_EMAILS = [
  "phcstudiosl@gmail.com"
];

// =========================
// LOGIN GOOGLE
// =========================
window.loginGoogle = async () => {
try {

const result = await signInWithPopup(auth, provider);

document.getElementById("usuario").innerHTML =
"Conectado como: " + result.user.email;

// mostrar admin link
if (ADMIN_EMAILS.includes(result.user.email)) {
document.getElementById("adminLink").style.display = "block";
}

await cargarMisVacaciones();

} catch (error) {
  console.error(error);
  alert(error.code + " - " + error.message);
}
};


// =========================
// GUARDAR VACACIONES
// =========================
window.guardarVacaciones = async () => {

if (!auth.currentUser) {
alert("Debes iniciar sesión");
return;
}

const inicio = document.getElementById("inicio").value;
const fin = document.getElementById("fin").value;

if (!inicio || !fin) {
alert("Selecciona ambas fechas");
return;
}

await addDoc(collection(db, "vacaciones"), {
usuario: auth.currentUser.email,
nombre: auth.currentUser.displayName,
inicio,
fin,
estado: "pendiente",
fecha: new Date()
});

alert("Solicitud enviada");

cargarMisVacaciones();
};


// =========================
// CARGAR MIS VACACIONES
// =========================
async function cargarMisVacaciones() {

if (!auth.currentUser) return;

const lista = document.getElementById("lista");
lista.innerHTML = "";

const q = query(
collection(db, "vacaciones"),
where("usuario", "==", auth.currentUser.email)
);

const snapshot = await getDocs(q);

snapshot.forEach((registro) => {

const datos = registro.data();

const li = document.createElement("li");

li.innerHTML =
  datos.inicio +
  " → " +
  datos.fin +
  " (" +
  datos.estado +
  ")";
lista.appendChild(li);

});
}


// =========================
// AUTH STATE
// =========================
onAuthStateChanged(auth, async (user) => {

if (user) {

document.getElementById("usuario").innerHTML =
"Conectado como: " + user.email;

// mostrar admin si es admin
if (ADMIN_EMAILS.includes(user.email)) {
document.getElementById("adminLink").style.display = "block";
}

await cargarMisVacaciones();
}

});
