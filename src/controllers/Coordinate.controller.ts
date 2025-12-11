import { Request, Response } from "express";
import Coordinate from "../types/Coordinate.type";
import CoordinateService from "../services/Coordinate.service";
import UFs from "../const/UFs";

class CoordinateController {
    private service: CoordinateService

    constructor() {
        this.service = new CoordinateService()
    }

    public async getRandomCoord(req: Request, res: Response): Promise<void> {
        try {
            const { sigla } = req.params
            let codigo

            if (sigla) {
                const filteredUF = UFs.filter(u => u.sigla === sigla.toUpperCase())
                if (filteredUF.length === 0) {
                    res.sendStatus(400)
                    return
                } else {
                    codigo = filteredUF[0].codigo
                }
            }

            const randomCoord: Coordinate = await this.service.getRandomCoord(codigo)
            res.status(200).json(randomCoord)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default CoordinateController