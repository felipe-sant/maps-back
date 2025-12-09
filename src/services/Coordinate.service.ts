import Coordinate from "../types/Coordinate.type"
import GeoJson, { Feature } from "../types/GeoJson.type"
import IbgeAPI from "./api/Ibge.api"

class CoordinateService {
    private ibgeAPI: IbgeAPI

    constructor() {
        this.ibgeAPI = new IbgeAPI()
    }

    private getRandomState(states: GeoJson): Feature {
        const state = states.features[Math.floor(Math.random() * states.features.length)]
        return state
    }

    private getRandomCoordPerState(state: Feature): Coordinate {
        let points
        if (state.geometry.type === 'Polygon') {
            points = state.geometry.coordinates[0]
        } else {
            points = state.geometry.coordinates[0][0]
        }
        const randomPoint = points[Math.floor(Math.random() * points.length)]
        return { lat: randomPoint[1], lon: randomPoint[0] }
    }

    public async getCoord(): Promise<Coordinate> {
        const states = await this.ibgeAPI.getUfs()
        const state = this.getRandomState(states)
        const coord = this.getRandomCoordPerState(state)
        return coord
    }
}

export default CoordinateService