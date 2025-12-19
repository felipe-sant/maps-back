import LocalitiesService from "../../src/services/Localities.service"
import Coordinate from "../../src/types/Coordinate.type"
import MunicipioInfo from "../../src/types/MunicipioInfo.type"

describe("Test Localities.service", () => {
    const service = new LocalitiesService()

    it("LocalitiesService.getInfoPopulacaoPerMunicipio(codearea, periodo)", async () => {
        const info = await service.getInfoPopulacaoPerCode(3549904, "2021")
        const expectInfo = [{ "valor": 737310, "ano": "2021" }]
        expect(info).toEqual(expectInfo)
    })

    it("LocalitiesService.getInfo(coordinate)", async () => {
        const coord: Coordinate = { lat: -23.2237, lon: -45.9009 }
        const info = await service.getInfo(coord)

        const expectInfo: MunicipioInfo = {
            "codearea": 3549904,
            "municipio": "São José dos Campos",
            "estado": "São Paulo",
            "regiao": "Sudeste"
        }

        expect(info).toEqual(expectInfo)
    })
})