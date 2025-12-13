import { Request, Response } from "express";
import Coordinate from "../types/Coordinate.type";
import LocalitiesService from "../services/Localities.service";
import CoordinateService from "../services/Coordinate.service";
import Periodo from "../types/Periodo.type";
import Anos from "../const/Anos";

class LocalitiesController {
    private service: LocalitiesService
    private service_coord: CoordinateService

    constructor() {
        this.service = new LocalitiesService()
        this.service_coord = new CoordinateService()
    }

    public async getInfoLocation(req: Request, res: Response) {
        try {
            const { lon, lat, ano } = req.query
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

            let periodo: Periodo | undefined
            if (ano) {
                let valid = false
                Anos.forEach(a => {
                    if (ano === a) {
                        valid = true
                    }
                })
                if(!valid) {
                    res.status(400).json("The valid years are '2001', '2002', '2003', '2004', '2005', '2006', '2008', '2009', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2024', '2025'")
                    return
                } else {
                    periodo = ano as Periodo
                }
            }

            const info = await this.service.getInfo(coordinate, periodo)

            res.status(200).json(info)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getPopulacao(req: Request, res: Response) {
        try {
            const { codearea } = req.params
            const { ano } = req.query

            const code = Number(codearea)
            if(isNaN(code)) {
                res.status(400).json("'codearea' must be a number")
                return
            }

            const isValidCode = await this.service.isValidCodearea(code)
            if (!isValidCode) {
                res.status(400).json("'codearea' does not belong to a municipality")
                return
            }

            let periodo: Periodo | undefined
            if (ano) {
                let valid = false
                Anos.forEach(a => {
                    if (ano === a) {
                        valid = true
                    }
                })
                if(!valid) {
                    res.status(400).json("The valid years are '2001', '2002', '2003', '2004', '2005', '2006', '2008', '2009', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2024', '2025'")
                    return
                } else {
                    periodo = ano as Periodo
                }
            }

            const populacao = await this.service.getInfoPopulacaoPerMunicipio(code, periodo)
            res.status(200).json(populacao)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default LocalitiesController