
import express, { json } from "express"
import {config} from "dotenv"
import cors from "cors"
import morgan from "morgan"
import { amazon, ebay, newegg} from "./functions/functions.js"
config()

const corsOptions = {
    
    origin: process.env.FRONTCONNECT || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
  

const app = express()
app.use(morgan())
app.use(cors())
app.use(express.json())


export let results = []

app.get("/resuelto/:ecommerce/:items/:quantity", cors(corsOptions), async (req,res) => {
    let ecommerce = req.params.ecommerce
    let item = req.params.items
   
    
    try {
        results = []
        if(item.trim() === "") throw new Error("You need to give us an product")
        else{
        ecommerce.includes("Amazon") && await amazon(req.params.items, req.params.quantity)
        ecommerce.includes("newEgg") && await newegg(req.params.items, req.params.quantity)
        ecommerce.includes("eBay") && await ebay(req.params.items, req.params.quantity)
         return res.status(200).json(results)
        }
        
    
   
    } catch (error) {
  
        if(error.message === "You need to give us an product"){
            res.status(400).json(error.message)
        
        }else{
            res.status(500).json(error)
        }
        
        
    }
    
})







app.listen(8000, () => console.log("Running on port http://localhost:8000"))
