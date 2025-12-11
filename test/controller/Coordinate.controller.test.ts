import request from "supertest"
import app from "../../src/app"

describe("Test Coordinate.controller", () => {
    it("GET | /api/coordinate - OK", async () => {
        const url = "/api/coordinate"
        const response = await request(app).get(url)
        expect(response.status).toBe(200)
    })
    
    it("GET | /api/coordinate/:sigla - Bad Request", async () => {
        const url = "/api/coordinate/not_is_uf_code"
        const response = await request(app).get(url)
        expect(response.status).toBe(400)
    })

    it("GET | /api/coordinate/:sigla - OK", async () => {
        const url = "/api/coordinate/sp"
        const response = await request(app).get(url)
        expect(response.status).toBe(200)
    })
})