import LocalitiesService from "../../src/services/Localities.service"
import Coordinate from "../../src/types/Coordinate.type"
import Info from "../../src/types/Info.type"

describe("Test Localities.service", () => {
    const service = new LocalitiesService()

    it("LocalitiesService.getInfo(coordinate)", async () => {
        const coord: Coordinate = { lat: -23.2237, lon: -45.9009 }
        const info: Info = await service.getInfo(coord)

        const expectInfo: Info = {
            municipio: 'São José dos Campos',
            estado: 'São Paulo',
            regiao: 'Sudeste'
        }

        expect(info).toEqual(expectInfo)
    })
})