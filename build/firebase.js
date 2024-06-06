"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketStatus = exports.createTicket = void 0;
const app_1 = require("firebase/app");
const lite_1 = require("firebase/firestore/lite");
const firebaseConfig = {
    apiKey: "AIzaSyDpxPub8-c8BE6hkDDbcCjmKy7MpQH0CL8",
    authDomain: "helpdesk-bot-1276e.firebaseapp.com",
    projectId: "helpdesk-bot-1276e",
    storageBucket: "helpdesk-bot-1276e.appspot.com",
    messagingSenderId: "1093191074383",
    appId: "1:1093191074383:web:477e0249e598f9c0b5203a"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, lite_1.getFirestore)(app);
function createTicket(threadId, text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, lite_1.setDoc)((0, lite_1.doc)(db, 'tickets', threadId), {
                threadId,
                text,
                openedAt: new Date(),
                status: 'open'
            });
            console.log(`Ticket ${threadId} criado com sucesso`);
        }
        catch (e) {
            console.error("Erro ao criar o ticket: ", e);
        }
    });
}
exports.createTicket = createTicket;
// Função para atualizar o status de um ticket
function updateTicketStatus(threadId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Referência ao documento específico com o threadId
            const ticketRef = (0, lite_1.doc)(db, 'tickets', threadId);
            // Atualiza o documento com o novo status
            yield (0, lite_1.updateDoc)(ticketRef, {
                status,
            });
            console.log(`Ticket ${threadId} atualizado para o status: ${status}`);
        }
        catch (e) {
            console.error("Erro ao atualizar o status do ticket: ", e);
        }
    });
}
exports.updateTicketStatus = updateTicketStatus;
