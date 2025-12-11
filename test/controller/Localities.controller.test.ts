import request from "supertest"
import app from "../../src/app"

describe("Test Localities.controller", () => {
    it("GET | /api/location - Bad Request", async () => {
        const url = "/api/location"
        const response = await request(app).get(url)
        expect(response.status).toBe(400)
    })

    it("GET | /api/location - Bad Request", async () => {
        const url = "/api/location"
        const q = {
            lat: "lat",
            lon: "lon"
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(400)
    })

    it("GET | /api/location - OK", async () => {
        const url = "/api/location"
        const q = {
            lat: -23.2237,
            lon: -45.9009
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(200)
    })
})