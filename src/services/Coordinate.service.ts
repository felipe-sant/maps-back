import UFs from "../const/UFs"
import Coordinate from "../types/Coordinate.type"
import { Feature } from "../types/GeoJson.type"
import IbgeAPI from "./api/Ibge.api"

class CoordinateService {
    private ibgeAPI: IbgeAPI

    constructor() {
        this.ibgeAPI = new IbgeAPI()
    }

    private getRandomState(): number {
        const uf = UFs[Math.floor(Math.random() * UFs.length)]
        return uf.codigo
    }

    private getRandomCoordPerState(state: Feature): Coordinate {
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

    public async getCoord(): Promise<Coordinate> {
        const uf = this.getRandomState()
        const state = await this.ibgeAPI.getMalhaPerUF(uf)

        const feature = state.features[0]
        if (!feature) {
            throw new Error("Nenhuma feature encontrada para essa UF")
        }

        return this.getRandomCoordPerState(feature)
    }

}

export default CoordinateService