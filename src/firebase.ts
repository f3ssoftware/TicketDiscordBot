import { initializeApp } from "firebase/app";
import {addDoc, getFirestore, collection, updateDoc, doc, setDoc} from "firebase/firestore/lite"

const firebaseConfig = {
  apiKey: "AIzaSyDpxPub8-c8BE6hkDDbcCjmKy7MpQH0CL8",
  authDomain: "helpdesk-bot-1276e.firebaseapp.com",
  projectId: "helpdesk-bot-1276e",
  storageBucket: "helpdesk-bot-1276e.appspot.com",
  messagingSenderId: "1093191074383",
  appId: "1:1093191074383:web:477e0249e598f9c0b5203a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export async function createTicket(threadId: string, text: string) {
    try {
        await setDoc(doc(db, 'tickets', threadId), {
            threadId,
            text,
            openedAt: new Date(),
            status: 'open'
        });
        console.log(`Ticket ${threadId} criado com sucesso`);
    } catch (e) {
        console.error("Erro ao criar o ticket: ", e);
    }
}

// Função para atualizar o status de um ticket
export async function updateTicketStatus(threadId: string, status: string) {
    try {
        // Referência ao documento específico com o threadId
        const ticketRef = doc(db, 'tickets', threadId);

        // Atualiza o documento com o novo status
        await updateDoc(ticketRef, {
            status,
        });

        console.log(`Ticket ${threadId} atualizado para o status: ${status}`);
    } catch (e) {
        console.error("Erro ao atualizar o status do ticket: ", e);
    }
}
