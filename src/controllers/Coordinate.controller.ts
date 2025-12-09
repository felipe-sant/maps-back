import { Request, Response } from "express";
import Coordinate from "../types/Coordinate.type";
import CoordinateService from "../services/Coordinate.service";

class CoordinateController {
    private service: CoordinateService

    constructor() {
        this.service = new CoordinateService()
    }

    public async getRandomCoord(_: Request, res: Response): Promise<void> {
        try {
            const randomCoord: Coordinate = await this.service.getCoord()
            res.status(200).json(randomCoord)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default CoordinateController