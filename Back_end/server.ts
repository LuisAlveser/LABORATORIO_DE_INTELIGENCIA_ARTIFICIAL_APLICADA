import express from "express"
import{responsavelRota} from "./src/routers/ResponsavelRota"
import{criancaRota} from "./src/routers/CriancaRota"
import{historiaRota} from "./src/routers/HistoriaRota"
const app=express()
const rota:number=3000

app.use(express.json());

app.use(responsavelRota)
app.use(criancaRota)
app.use(historiaRota)
app.listen(rota,()=>{
    console.log("Servidor rodando!!")
})
