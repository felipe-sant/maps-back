import Coordinate from "../types/Coordinate.type";
import IbgeAPI from "./api/Ibge.api";
import { point } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import GeoJson from "../types/GeoJson.type";
import MunicipioInfo from "../types/MunicipioInfo.type";
import PopulacaoInfo from "../types/PopulacaoInfo.type";
import Periodo from "../types/Periodo.type";

class LocalitiesService {
    private ibgeAPI: IbgeAPI

    constructor() {
        this.ibgeAPI = new IbgeAPI()
    }

    public async findStatePerPoint(coordinate: Coordinate): Promise<number | undefined> {
        const p = point([coordinate.lon, coordinate.lat])
        const ufs: GeoJson = await this.ibgeAPI.getMalhaUFs()
        for (const u of ufs.features) {
            const inUf = booleanPointInPolygon(p, u.geometry)
            if (!inUf) continue
            return Number(u.properties.codarea)
        }
        return undefined
    }

    public async findMunicipioPerPoint(coordinate: Coordinate): Promise<number | undefined> {
        const p = point([coordinate.lon, coordinate.lat])
        const ufs: GeoJson = await this.ibgeAPI.getMalhaUFs()
        for (const u of ufs.features) {
            const inUf = booleanPointInPolygon(p, u.geometry)
            if (!inUf) continue
            const municipios = await this.ibgeAPI.getMalhaMunicipioPerUF(Number(u.properties.codarea))
            for (const m of municipios.features) {
                const inMunicipio = booleanPointInPolygon(p, m.geometry)
                if (!inMunicipio) continue
                return Number(m.properties.codarea)
            }
        }
        return undefined
    }

    public async getInfo(coordinate: Coordinate): Promise<MunicipioInfo | undefined> {
        const codearea = await this.findMunicipioPerPoint(coordinate)
        if (!codearea) throw new Error("Nenhum código de area encontrado nesse ponto")
        const infoLocalidade = await this.ibgeAPI.getLocalidadePerMunicipio(codearea)
        if (!infoLocalidade) throw new Error("O municipio não foi encontrado")
        return infoLocalidade
    }

    public async getInfoPopulacaoPerCode(codearea: number, periodo?: Periodo): Promise<PopulacaoInfo[]> {
        const infoPopulacao = await this.ibgeAPI.getPopulacaoPerCode(codearea, periodo)
        return infoPopulacao
    }

}

export default LocalitiesService