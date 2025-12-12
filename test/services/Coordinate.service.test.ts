import CoordinateService from "../../src/services/Coordinate.service"
import Coordinate from "../../src/types/Coordinate.type"

describe("Test Coordinate.service", () => {
    const service = new CoordinateService()

    it("CoordinateService.pointInBrazil", async () => {
        const res: boolean[] = []

        const inBrazil: Coordinate = { lat: -15.7934, lon: -47.8825 }
        res.push(await service.pointInBrazil(inBrazil)) // return true

        const notInBrazil: Coordinate = { lat: 0, lon: 0 }
        res.push(await service.pointInBrazil(notInBrazil)) // return false

        expect(res).toEqual([true, false])
    })

    it("CoordinateService.pointInState", async () => {
        const res: boolean[] = []

        const inDF: Coordinate = { lat: -15.7934, lon: -47.8825 }
        res.push(await service.pointInState(inDF, 53)) // return true

        const notInDF: Coordinate = { lat: -23.2237, lon: -45.9009 }
        res.push(await service.pointInState(notInDF, 53)) // return false

        expect(res).toEqual([true, false])
    })
})