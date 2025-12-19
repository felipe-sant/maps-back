import { point } from "@turf/helpers"
import Coordinate from "../types/Coordinate.type"
import GeoJson, { Feature } from "../types/GeoJson.type"
import getRandomState from "../utils/getRandomState"
import IbgeAPI from "./api/Ibge.api"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import getRandomCoordPerStateObj from "../utils/getRandomCoordPerStateObj"

class CoordinateService {
    private ibgeAPI: IbgeAPI

    constructor() {
        this.ibgeAPI = new IbgeAPI()
    }

    public async pointInBrazil(coordinate: Coordinate): Promise<boolean> {
        const p = point([coordinate.lon, coordinate.lat])
        const ufs: GeoJson = await this.ibgeAPI.getMalhaUFs()
        for (const u of ufs.features) {
            const inUf = booleanPointInPolygon(p, u.geometry)
            if (inUf) return true
        }
        return false
    }

    public async isValidCodeareaMunicipio(codearea: number): Promise<boolean> {
        const infoLocalidade = await this.ibgeAPI.getLocalidadePerMunicipio(codearea)
        if (!infoLocalidade) {
            return false
        } else {
            return true
        }
    }

    public async isValidCodeareaState(codearea: number): Promise<boolean> {
        const infoLocalidade = await this.ibgeAPI.getLocalidadePerEstado(codearea)
        if (!infoLocalidade) {
            return false
        } else {
            return true
        }
    }

    public async pointInState(coordinate: Coordinate, code: number): Promise<boolean> {
        const p = point([coordinate.lon, coordinate.lat])
        const uf: GeoJson = await this.ibgeAPI.getMalhaMunicipioPerUF(code)
        for (const m of uf.features) {
            const inMun = booleanPointInPolygon(p, m.geometry, { ignoreBoundary: false })
            if (inMun) return true
        }
        return false
    }

    public async getRandomCoord(codigo?: number): Promise<Coordinate> {
        codigo = codigo ? codigo : getRandomState()
        const state = await this.ibgeAPI.getMalhaPerUF(codigo)
        const feature = state.features[0]
        if (!feature) throw new Error("Nenhuma feature encontrada para essa UF")
        return getRandomCoordPerStateObj(feature)
    }
}

export default CoordinateService