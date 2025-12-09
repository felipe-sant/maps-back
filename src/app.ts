import express, { Request, Response } from 'express'
import cors from 'cors'
import requestLoggerMiddleware from './middlewares/requestLogger.middleware'
import dotenv from "dotenv"
import coordinateRoutes from './routes/Coordinate.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLoggerMiddleware)

app.use("/api", coordinateRoutes)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app