import Coordinate from "../types/Coordinate.type";
import IbgeAPI from "./api/Ibge.api";
import { point } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import GeoJson from "../types/GeoJson.type";
import Info from "../types/Info.type";

class LocalitiesService {
    private ibgeAPI: IbgeAPI

    constructor() {
        this.ibgeAPI = new IbgeAPI()
    }

    private async findMunicipioPerPoint(coordinate: Coordinate): Promise<number | undefined> {
        const p = point([coordinate.lon, coordinate.lat])

        const ufs: GeoJson = await this.ibgeAPI.getMalha()
        for(const u of ufs.features) {
            const inUf = booleanPointInPolygon(p, u.geometry)
            if (!inUf) continue

            const municipios = await this.ibgeAPI.getMalhaMunicipioPerUF(Number(u.properties.codarea))
            for(const m of municipios.features) {
                const inMunicipio = booleanPointInPolygon(p, m.geometry)
                if (!inMunicipio) continue

                return Number(m.properties.codarea)
            }
        }

        return undefined
    }

    public async getInfo(coordinate: Coordinate): Promise<Info> {
        const codearea = await this.findMunicipioPerPoint(coordinate)
        if (!codearea) throw new Error("Nenhum código de area encontrado nesse ponto")

        const info = await this.ibgeAPI.getLocalidadePerMunicipio(codearea)
        return info
    }
}

export default LocalitiesService