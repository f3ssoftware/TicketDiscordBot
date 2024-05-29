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

         await thread.send("This conversation is marked as resolve and this thread will be archieved ")
         await thread.setArchived(true)
         await updateTicketStatus(threadId as string, 'resolved');
         return res.status(200).send("Thread resolved")

    })
    return app;
}