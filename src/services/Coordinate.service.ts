import UFs from "../const/UFs"
import Coordinate from "../types/Coordinate.type"
import { Feature } from "../types/GeoJson.type"
import getRandomState from "../utils/getRandomState"
import IbgeAPI from "./api/Ibge.api"

class CoordinateService {
    private ibgeAPI: IbgeAPI

    constructor() {
        this.ibgeAPI = new IbgeAPI()
    }

    private getRandomCoordPerStateObj(state: Feature): Coordinate {
        let points: number[][]

        if (state.geometry.type === 'Polygon') {
            points = state.geometry.coordinates[0]
        } else {
            points = state.geometry.coordinates[0][0]
        }

        if (!points || points.length === 0) {
            throw new Error("UF sem coordenadas válidas")
        }

        const randomPoint = points[Math.floor(Math.random() * points.length)]

        return {
            lat: randomPoint[1],
            lon: randomPoint[0],
        }
    }

    public async getRandomCoord(codigo?: number): Promise<Coordinate> {
        codigo = getRandomState()

        const state = await this.ibgeAPI.getMalhaPerUF(codigo)

        const feature = state.features[0]
        if (!feature) throw new Error("Nenhuma feature encontrada para essa UF")

        return this.getRandomCoordPerStateObj(feature)
    }

}

export default CoordinateService