// Importa as funções necessárias
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import  {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET,SENDER_ID, API_ID , MESAR_ID } from '@env'
// Configuração do Firebase
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: SENDER_ID,
  appId: API_ID,
  measurementId: MESAR_ID
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app); // Firestore para acessar os dados

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
