import { Request, Response } from "express";
import Coordinateervice from "../services/Coordinate.service";
import CoordinateType from "../types/Coordinate.type";

class CoordinateController {
    private service: Coordinateervice

    constructor() {
        this.service = new Coordinateervice()
    }

    public async getRandomCoord(_: Request, res: Response): Promise<void> {
        try {
            const randomCoord: CoordinateType = await this.service.getRandomCoord()
            res.status(200).json(randomCoord)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default CoordinateController