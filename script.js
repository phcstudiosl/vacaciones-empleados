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
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4Us97wrmB3ejRL0ZLbWDLBoQLeHWLcmI",
  authDomain: "vacaciones-empleados-70799.firebaseapp.com",
  projectId: "vacaciones-empleados-70799",
  storageBucket: "vacaciones-empleados-70799.firebasestorage.app",
  messagingSenderId: "381217960651",
  appId: "1:381217960651:web:2e9c8d8646fb813c39e14e"
};

const app = initializeApp(firebaseConfig);
console.log(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
async function esAdmin(uid){

const userRef = doc(db,"users",uid);

const userSnap = await getDoc(userRef);


if(!userSnap.exists()){
return false;
}


return userSnap.data().role === "admin";

}
;

// =========================
// LOGIN GOOGLE
// =========================
window.loginGoogle = async () => {

try {

const result = await signInWithPopup(auth, provider);

const user = result.user;


const userRef = doc(db,"users",user.uid);

const userSnap = await getDoc(userRef);



if(!userSnap.exists()){

await setDoc(userRef,{

email:user.email,

name:user.displayName,

role:"employee",

barId:"bar1"

});

}



document.getElementById("usuario").innerHTML =
"Conectado como: " + user.email;



if(await esAdmin(user.uid)){

const admin =
document.getElementById("adminLink");


if(admin){

admin.style.display="block";

}

}



await cargarMisVacaciones();



}catch(error){

console.error(error);

alert(error.code+" - "+error.message);

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
onAuthStateChanged(auth, async (user)=>{


if(user){


document.getElementById("usuario").innerHTML =
"Conectado como: " + user.email;



if(await esAdmin(user.uid)){


const admin =
document.getElementById("adminLink");


if(admin){

admin.style.display="block";

}

}



await cargarMisVacaciones();


}


});
