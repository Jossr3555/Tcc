// Importa as funções necessárias
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsi3PRqxi8PgqAS7lMCmQzXZxBny13tcY",
  authDomain: "myelectives-74e9c.firebaseapp.com",
  projectId: "myelectives-74e9c",
  storageBucket: "myelectives-74e9c.firebasestorage.app",
  messagingSenderId: "329109661930",
  appId: "1:329109661930:web:d8fbfe3b1264930c368f93",
  measurementId: "G-3CG0XSJSVJ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore para acessar os dados

export const validarAcesso = async (email, password) => {
    try {
        // 1. Autentica o usuário com e-mail e senha
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Usuário autenticado:", user.uid);

        // 2. Obtém os dados do usuário no Firestore pelo UID
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data(); 
            return { sucesso: true, nome: userData.nome, rm: userData.RM };
        } else {
            return { sucesso: false, mensagem: "Usuário não encontrado no Firestore" };
        }
    } catch (error) {
        console.error("Erro ao validar acesso:", error.message);
        return { sucesso: false, mensagem: "Usuário ou senha incorretos." };
    }
};
