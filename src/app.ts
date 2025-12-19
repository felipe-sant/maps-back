import express, { Request, Response } from 'express'
import cors from 'cors'
import requestLoggerMiddleware from './middlewares/requestLogger.middleware'
import dotenv from "dotenv"
import coordinateRoutes from './routes/Coordinate.routes'
import localitiesRoutes from './routes/Localities.routes'
import createPaste from './utils/createPaste'

createPaste(".cache/")
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLoggerMiddleware)

app.use("/api", coordinateRoutes)
app.use("/api", localitiesRoutes)
app.get("/health", (_: Request, res: Response) => {
    res.send("OK Vercel")
})

export default app