import express from 'express';
import handlebars from "express-handlebars";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js"; 
import mongoose from "mongoose";
import messagesManagerDB from "./dao/cartManagerDB.js";

const app = express();

const uri ="mongodb://127.0.0.1:27017//://lma:Nelson1204@cluster0.9d6vkgf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);


app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(__dirname + '/../public'));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//BIENVENIDA
app.get('/', (req, res) => {
  res.send("Bievenido")
})

//ROUTES
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/products", viewsRouter);


const port = 8080;

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

// SOCKET SERVER CHAT
const socketServer = new Server(httpServer);
const messagesManagerService = new messagesManagerDB()

app.get('/chat', async (req, res) => {
  const chat = await messagesManagerService.getMessages({})
  res.render(
    "chat",
    {
      style: 'index.css',
      layout: 'main',
      chat: chat
    }
  )
})

socketServer.on("connection", socket => {
  socket.on("addMessage", async messageData => {
    await messagesManagerService.addMessage(messageData.user, messageData.message)
  })

  socket.on("getMessages", async () => {
    const message = await messagesManagerService.getMessages()
    socket.emit("receiveMessages", message)
  })
})
websocket(io);