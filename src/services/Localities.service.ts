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

    private async findMunicipioPerPoint(coordinate: Coordinate): Promise<number | undefined> {
        const p = point([coordinate.lon, coordinate.lat])

        const ufs: GeoJson = await this.ibgeAPI.getMalha()
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

    public async getInfoPopulacaoPerCode(codearea: number, periodo?: Periodo): Promise<PopulacaoInfo[]> {
        const infoPopulacao = await this.ibgeAPI.getPopulacaoPerCode(codearea, periodo)
        return infoPopulacao
    }

    public async getInfo(coordinate: Coordinate, periodo?: Periodo): Promise<{ localidade: MunicipioInfo, populacao: PopulacaoInfo[] } | undefined> {
        const codearea = await this.findMunicipioPerPoint(coordinate)
        if (!codearea) throw new Error("Nenhum código de area encontrado nesse ponto")

        const infoLocalidade = await this.ibgeAPI.getLocalidadePerMunicipio(codearea)
        if (!infoLocalidade) throw new Error("O municipio não foi encontrado")

        const infoPopulacao = await this.ibgeAPI.getPopulacaoPerCode(codearea, periodo)

        return { localidade: infoLocalidade, populacao: infoPopulacao }
    }
}

export default LocalitiesService