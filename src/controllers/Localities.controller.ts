import { Request, Response } from "express";
import Coordinate from "../types/Coordinate.type";
import LocalitiesService from "../services/Localities.service";

class LocalitiesController {
    private service: LocalitiesService

    constructor() {
        this.service = new LocalitiesService()
    }

    public async getInfoLocation(req: Request, res: Response) {
        try {
            const { lon, lat } = req.query
            if (!lon || !lat) {
                res.status(400).json("'lon' and 'lat' is required in query")
                return
            }

            const nLon = Number(lon)
            const nLat = Number(lat)
            if (isNaN(nLon) || isNaN(nLat)) {
                res.status(400).json("'lon' and 'lat' have to be numbers")
                return
            }

            const coordinate: Coordinate = { lat: nLat, lon: nLon }
            if (!await this.service.pointInBrazil(coordinate)) {
                res.status(422).json("The coordinates must be in Brazil.")
                return
            }
            
            const info = await this.service.getInfo(coordinate)
            res.status(200).json(info)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default LocalitiesController