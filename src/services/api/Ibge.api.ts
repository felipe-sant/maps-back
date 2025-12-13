import GeoJson from "../../types/GeoJson.type"
import ReqFunc from "./__reqfunc"
import readFile from "../../utils/readFile"
import createFile from "../../utils/createFile"
import MunicipioInfo_brute from "../../types/MunicipioInfo_brute.type"
import MunicipioInfo from "../../types/MunicipioInfo.type"
import PopulacaoInfo_brute from "../../types/PopulacaoInfo_brute.type"
import PopulacaoInfo from "../../types/PopulacaoInfo.type"
import Periodo from "../../types/Periodo.type"

class IbgeAPI {
    private readonly url = 'https://servicodados.ibge.gov.br/api/'
    private readonly url_malhas_uf = this.url + "v4/malhas/estados/"
    private readonly url_malhas_pais = this.url + "v4/malhas/paises/"
    private readonly url_localidades = this.url + "v1/localidades/municipios/"
    private readonly url_populacao = this.url + "v3/agregados/6579/periodos/all/variaveis"

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

    public async getLocalidadePerMunicipio(municipio: number): Promise<MunicipioInfo> {
        const cache_url = ".cache/localidade_municipio_" + municipio + ".json"

        const file = readFile(cache_url)
        if (file) {
            return JSON.parse(file)
        }

        const query = {
            view: "nivelado"
        }
        const response = await ReqFunc.getReq<MunicipioInfo_brute>(this.url_localidades + municipio, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar informações de municipio")

        const info: MunicipioInfo = {
            municipio: response.content["municipio-nome"],
            estado: response.content["UF-nome"],
            regiao: response.content["regiao-nome"]
        }

        createFile(cache_url, JSON.stringify(info))

        return info
    }

    public async getPopulacaoPerMunicipio(municipio: number, periodo?: Periodo): Promise<PopulacaoInfo[]> {
        const cache_url = periodo ? ".cache/populacao_municipio_" + municipio + "_" + periodo + ".json" : ".cache/populacao_municipio_" + municipio + ".json"

        const file = readFile(cache_url)
        if (file) {
            return JSON.parse(file)
        }
        
        const query = {
            localidades: `N6[${municipio}]`,
            view: "flat"
        }
        const response = await ReqFunc.getReq<PopulacaoInfo_brute[]>(this.url_populacao, query)
        if (response.status !== 200) throw new Error("Erro na api do ibge ao pegar informação de população geral")

        const populacaoBrute: PopulacaoInfo_brute[] = response.content
        const infoPopulacao: PopulacaoInfo[] = []

        let isFirst = true
        populacaoBrute.forEach(p => {
            if (isFirst) {
                isFirst = false
                return
            }

            const formatInfoPopulacao = {
                valor: Number(p.V),
                ano: p.D2C
            }

            if (periodo) {
                if (p.D2C === periodo) {
                    infoPopulacao.push(formatInfoPopulacao)
                }
            } else {
                infoPopulacao.push(formatInfoPopulacao)
            }
            
        })

        createFile(cache_url, JSON.stringify(infoPopulacao))

        return infoPopulacao
    }
}

export default IbgeAPI