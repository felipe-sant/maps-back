import CoordinateService from "../../src/services/Coordinate.service"
import Coordinate from "../../src/types/Coordinate.type"

describe("Test Coordinate.service", () => {
    const service = new CoordinateService()

    it("CoordinateService.pointInBrazil", async () => {
        const res: boolean[] = []

        const inBrazil: Coordinate = { lat: -15.7934, lon: -47.8825 }
        res.push(await service.pointInBrazil(inBrazil))

        const notInBrazil: Coordinate = { lat: 0, lon: 0 }
        res.push(await service.pointInBrazil(notInBrazil))

        expect(res).toEqual([true, false])
    })
})