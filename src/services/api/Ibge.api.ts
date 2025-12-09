import GeoJson from "../../types/GeoJson.type"
import ReqFunc from "./__reqfunc"

class IbgeAPI {
    private readonly url = 'https://servicodados.ibge.gov.br/api/'
    private readonly url_malhas = this.url + "v4/malhas/paises/BR"

    public async getUfs(): Promise<GeoJson> {
        // implementar sistema de cache aqui
        // readFile() if else

        const query = {
            formato: 'application/vnd.geo+json',
            intrarregiao: 'UF',
            qualidade: 'minima'
        }
        const response = await ReqFunc.getReq<GeoJson>(this.url_malhas, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge")

        // createFile()

        return response.content
    }
}

export default IbgeAPI