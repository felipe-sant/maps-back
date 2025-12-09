import CoordinateType from "../types/Coordinate.type";

class Coordinateervice {
    public async getRandomCoord(): Promise<CoordinateType> {
        return { lat: 0, lon: 0 }
    }
}

export default Coordinateervice