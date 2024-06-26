import {Client, ThreadChannel} from "discord.js"
import express from "express"
import { updateTicketStatus } from "./firebase"

export function createRestApi(client: Client){
    const app = express()
    app.use(express.json())

    app.get("/messages", async(req, res) =>{
         const {threadId} = req.query
         if(!threadId){
            return res.status(400).send("Missing threadId")
         }
         const thread = await client.channels.fetch(threadId as string) as ThreadChannel;
         if(!thread){
            return res.status(404).send("Thread with this id was not found")
         }
         const messages = await thread.messages.fetch()
         return res.status(200).send(JSON.stringify(messages || []))
    })

    app.post("/message", async(req,res)=>{
        const {threadId, text} = req.body
        if(!threadId){
            return res.status(400).send("Missing threadId")
         }
         if(!text){
            return res.status(400).send("Missing Text")
         }

         const thread = await client.channels.fetch(threadId as string) as ThreadChannel;
         if(!thread){
            return res.status(404).send("Thread with this id was not found")
         }
         await thread.send(text)
         return res.status(200).send("Message sent")
    })

    app.post("/resolve", async(req,res)=>{
        const {threadId} = req.body
        if(!threadId){
            return res.status(400).send("Missing threadId")
         }
         const thread = await client.channels.fetch(threadId as string) as ThreadChannel;
         if(!thread){
            return res.status(404).send("Thread with this id was not found")
         }
         if (thread.archived) {
            return res.status(400).send("Thread is already archived.");
        }

         await thread.send("This ticket is marked as resolve and this thread will be archieved ")
         await thread.setArchived(true)
         await updateTicketStatus(threadId as string, 'resolved');
         return res.status(200).send("Thread resolved")

    })

    app.post("/not-resolved", async (req, res) => {
      const { threadId } = req.body;
      if (!threadId) {
        return res.status(400).send("Missing threadId");
      }
      const thread = await client.channels.fetch(threadId) as ThreadChannel;
      if (!thread) {
        return res.status(404).send("Thread with this id was not found");
      }
    
      await thread.send("This ticket is marked as not resolved and this thread will be archived.");
      await thread.setArchived(true);
      await updateTicketStatus(threadId, 'not resolved');
      return res.status(200).send("Thread not resolved");
    });

    app.post("/analyzing", async (req, res) => {
      const { threadId } = req.body;
      if (!threadId) {
        return res.status(400).send("Missing threadId");
      }
      const thread = await client.channels.fetch(threadId) as ThreadChannel;
      if (!thread) {
        return res.status(404).send("Thread with this id was not found");
      }
    
      await thread.send("This ticket is currently being analyzed.");
      await updateTicketStatus(threadId, 'analyzing');
      return res.status(200).send("Thread analyzing");
    });

    return app;

    
}