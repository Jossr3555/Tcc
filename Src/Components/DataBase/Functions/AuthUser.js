import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, onSnapshot, collection } from "firebase/firestore";
import { auth, db } from "../DataLauncher";

export const validarAcesso = async (email, password) => {

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("Usuário autenticado:", user.uid);
  
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data(); 
        console.log(userData);
        return { 
          sucesso: true, 
          nome: userData.nome, 
          rm: userData.RM, 
          ano: userData.Ano 
        };
      } else {
        return { sucesso: false, mensagem: "Usuário não encontrado no Firestore" };
      }
  
    } catch (error) {
      console.error("Erro ao validar acesso:", error.message);
      return { sucesso: false, mensagem: "Usuário ou senha incorretos." };
    }
  };