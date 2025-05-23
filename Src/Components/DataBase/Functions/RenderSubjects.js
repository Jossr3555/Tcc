import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../DataLauncher";

export const RenderSubjects = {
    
  RenderEletivas: (setEletives, PersonUser) => {
    const eletivsCollection = collection(db, 'Eletivas');
    const unsubscribe = onSnapshot(eletivsCollection, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        const eletiva = { ...doc.data(), id: doc.id };
        if (eletiva.AnoDisponivel === PersonUser.ano) {
          list.push(eletiva);
        }
      });
      setEletives(list);
    });
    return unsubscribe;
  },

  RenderPlantoes: () => {
    // Implementar se necessário
  },

  RenderOficinas: () => {
    // Implementar se necessário
  },
};