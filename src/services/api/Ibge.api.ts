import GeoJson from "../../types/GeoJson.type"
import Info from "../../types/Info.type"
import InfoBrute from "../../types/InfoBrute.type"
import ReqFunc from "./__reqfunc"
import readFile from "../../utils/readFile"
import createFile from "../../utils/createFile"
import PopulacaoBrute from "../../types/PopulacaoBrute.type"
import Populacao from "../../types/Populacao.type"

class IbgeAPI {
    private readonly url = 'https://servicodados.ibge.gov.br/api/'
    private readonly url_malhas_uf = this.url + "v4/malhas/estados/"
    private readonly url_malhas_pais = this.url + "v4/malhas/paises/"
    private readonly url_localidades = this.url + "v1/localidades/municipios/"
    private readonly url_populacao = this.url + "v3/agregados/6579/periodos/"

    public async getMalha(): Promise<GeoJson> {
        const cache_url = ".cache/malha_ufs.json"

        const file = readFile(cache_url)
        if (file) {
            return JSON.parse(file)
        }

        const query = {
            formato: 'application/vnd.geo+json',
            qualidade: 'minima',
            intrarregiao: "UF"
        }
        const response = await ReqFunc.getReq<GeoJson>(this.url_malhas_pais + "BR", query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar malha por país")

        createFile(cache_url, JSON.stringify(response.content))

        return response.content
    }

    public async getMalhaPerUF(uf: number): Promise<GeoJson> {
        const cache_url = ".cache/malha_uf_" + uf + ".json"

        const file = readFile(cache_url)
        if (file) {
            return JSON.parse(file)
        }

        const query = {
            formato: 'application/vnd.geo+json',
            qualidade: 'minima'
        }
        const response = await ReqFunc.getReq<GeoJson>(this.url_malhas_uf + uf, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar malha por uf")

        createFile(cache_url, JSON.stringify(response.content))

        return response.content
    }

    public async getMalhaMunicipioPerUF(uf: number): Promise<GeoJson> {
        const cache_url = ".cache/malha_municipios_" + uf + ".json"

        const file = readFile(cache_url)
        if (file) {
            return JSON.parse(file)
        }

        const query = {
            formato: 'application/vnd.geo+json',
            qualidade: 'minima',
            intrarregiao: "municipio"
        }
        const response = await ReqFunc.getReq<GeoJson>(this.url_malhas_uf + uf, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar malha de municipio por uf")

        createFile(cache_url, JSON.stringify(response.content))

        return response.content
    }

    public async getLocalidadePerMunicipio(municipio: number): Promise<Info> {
        const cache_url = ".cache/localidade_municipio_" + municipio + ".json"

        const file = readFile(cache_url)
        if (file) {
            return JSON.parse(file)
        }

        const query = {
            view: "nivelado"
        }
        const response = await ReqFunc.getReq<InfoBrute>(this.url_localidades + municipio, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar informações de municipio")

        const info: Info = {
            municipio: response.content["municipio-nome"],
            estado: response.content["UF-nome"],
            regiao: response.content["regiao-nome"]
        }

        createFile(cache_url, JSON.stringify(info))

        return info
    }

    public async getPopulacao(periodo: string): Promise<Populacao> {
        const url = this.url_populacao + periodo + "/variaveis"
        const query = {
            localidades: "N1",
            view: "flat"
        }
        const response = await ReqFunc.getReq<PopulacaoBrute[]>(url, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar informação de população geral")

        const populacaoBrute: PopulacaoBrute = response.content[1]
        const populacao: Populacao = {
            ano: populacaoBrute.D2N,
            valor: Number(populacaoBrute.V)
        } 

        return populacao
    }
}

export default IbgeAPI