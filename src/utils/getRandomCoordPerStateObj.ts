import Coordinate from "../types/Coordinate.type"
import { Feature } from "../types/GeoJson.type"

function getRandomCoordPerStateObj(state: Feature): Coordinate {
    let points: number[][]
    if (state.geometry.type === 'Polygon') {
        points = state.geometry.coordinates[0]
    } else {
        points = state.geometry.coordinates[0][0]
    }
    if (!points || points.length === 0) { throw new Error("UF sem coordenadas válidas") }
    const randomPoint = points[Math.floor(Math.random() * points.length)]
    return {
        lat: randomPoint[1],
        lon: randomPoint[0],
    }
}

export default getRandomCoordPerStateObj