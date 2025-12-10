import GeoJson from "../../types/GeoJson.type"
import Info from "../../types/Info.type"
import InfoBrute from "../../types/InfoBrute.type"
import ReqFunc from "./__reqfunc"

class IbgeAPI {
    private readonly url = 'https://servicodados.ibge.gov.br/api/'
    private readonly url_malhas_uf = this.url + "v4/malhas/estados/"
    private readonly url_malhas_pais = this.url + "v4/malhas/paises/"
    private readonly url_localidades = this.url + "v1/localidades/municipios/"

    public async getMalha(): Promise<GeoJson> {
        // implementar sistema de cache aqui
        // readFile() if else

        const query = {
            formato: 'application/vnd.geo+json',
            qualidade: 'minima',
            intrarregiao: "UF"
        }
        const response = await ReqFunc.getReq<GeoJson>(this.url_malhas_pais + "BR", query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar malha por país")

        // createFile()

        return response.content
    }

    public async getMalhaPerUF(uf: number): Promise<GeoJson> {
        // implementar sistema de cache aqui
        // readFile() if else

        const query = {
            formato: 'application/vnd.geo+json',
            qualidade: 'minima'
        }
        const response = await ReqFunc.getReq<GeoJson>(this.url_malhas_uf + uf, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar malha por uf")

        // createFile()

        return response.content
    }

    public async getMalhaMunicipioPerUF(uf: number): Promise<GeoJson> {
        // implementar sistema de cache aqui
        // readFile() if else

        const query = {
            formato: 'application/vnd.geo+json',
            qualidade: 'minima',
            intrarregiao: "municipio"
        }
        const response = await ReqFunc.getReq<GeoJson>(this.url_malhas_uf + uf, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar malha de municipio por uf")
            
        // createFile()
        
        return response.content
    }

    public async getLocalidadePerMunicipio(municipio: number): Promise<Info> {
        // implementar sistema de cache aqui
        // readFile() if else

        const query = {
            view: "nivelado"
        }
        const response = await ReqFunc.getReq<InfoBrute>(this.url_localidades + municipio, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar informações por municipio")

        // createFile()

        const info: Info = {
            municipio: response.content["municipio-nome"],
            estado: response.content["UF-nome"],
            regiao: response.content["regiao-nome"]
        }

        return info
    }
}

export default IbgeAPI