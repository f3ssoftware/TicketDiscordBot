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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestApi = void 0;
const express_1 = __importDefault(require("express"));
const firebase_1 = require("./firebase");
function createRestApi(client) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get("/messages", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { threadId } = req.query;
        if (!threadId) {
            return res.status(400).send("Missing threadId");
        }
        const thread = yield client.channels.fetch(threadId);
        if (!thread) {
            return res.status(404).send("Thread with this id was not found");
        }
        const messages = yield thread.messages.fetch();
        return res.status(200).send(JSON.stringify(messages || []));
    }));
    app.post("/message", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { threadId, text } = req.body;
        if (!threadId) {
            return res.status(400).send("Missing threadId");
        }
        if (!text) {
            return res.status(400).send("Missing Text");
        }
        const thread = yield client.channels.fetch(threadId);
        if (!thread) {
            return res.status(404).send("Thread with this id was not found");
        }
        yield thread.send(text);
        return res.status(200).send("Message sent");
    }));
    app.post("/resolve", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { threadId } = req.body;
        if (!threadId) {
            return res.status(400).send("Missing threadId");
        }
        const thread = yield client.channels.fetch(threadId);
        if (!thread) {
            return res.status(404).send("Thread with this id was not found");
        }
        if (thread.archived) {
            return res.status(400).send("Thread is already archived.");
        }
        yield thread.send("This ticket is marked as resolve and this thread will be archieved ");
        yield thread.setArchived(true);
        yield (0, firebase_1.updateTicketStatus)(threadId, 'resolved');
        return res.status(200).send("Thread resolved");
    }));
    app.post("/not-resolved", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { threadId } = req.body;
        if (!threadId) {
            return res.status(400).send("Missing threadId");
        }
        const thread = yield client.channels.fetch(threadId);
        if (!thread) {
            return res.status(404).send("Thread with this id was not found");
        }
        yield thread.send("This ticket is marked as not resolved and this thread will be archived.");
        yield thread.setArchived(true);
        yield (0, firebase_1.updateTicketStatus)(threadId, 'not resolved');
        return res.status(200).send("Thread not resolved");
    }));
    app.post("/analyzing", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { threadId } = req.body;
        if (!threadId) {
            return res.status(400).send("Missing threadId");
        }
        const thread = yield client.channels.fetch(threadId);
        if (!thread) {
            return res.status(404).send("Thread with this id was not found");
        }
        yield thread.send("This ticket is currently being analyzed.");
        yield (0, firebase_1.updateTicketStatus)(threadId, 'analyzing');
        return res.status(200).send("Thread analyzing");
    }));
    return app;
}
exports.createRestApi = createRestApi;
