import { Request, Response } from "express";
import Coordinate from "../types/Coordinate.type";
import LocalitiesService from "../services/Localities.service";
import CoordinateService from "../services/Coordinate.service";

class LocalitiesController {
    private service: LocalitiesService
    private service_coord: CoordinateService

    constructor() {
        this.service = new LocalitiesService()
        this.service_coord = new CoordinateService()
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
            if (!await this.service_coord.pointInBrazil(coordinate)) {
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