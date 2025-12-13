import request from "supertest"
import app from "../../src/app"

describe("Test Localities.controller", () => {
    it("GET | /api/location - Bad Request", async () => {
        const url = "/api/location"
        const response = await request(app).get(url)
        expect(response.status).toBe(400)
    })

    it("GET | /api/location?lat=lat&lon=lon - Bad Request", async () => {
        const url = "/api/location"
        const q = {
            lat: "lat",
            lon: "lon"
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(400)
    })

    it("GET | /api/location?lat=0&lon=0 - Unprocessable Entity", async () => {
        const url = "/api/location"
        const q = {
            lat: 0,
            lon: 0
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(422)
    })

    it("GET | /api/location - Bad Request", async () => {
        const url = "/api/location"
        const q = {
            lat: -23.2237,
            lon: -45.9009,
            ano: "1900"
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(400)
    })

    it("GET | /api/location - OK", async () => {
        const url = "/api/location"
        const q = {
            lat: -23.2237,
            lon: -45.9009,
            ano: "2025"
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(200)
    })

    it("GET | /api/location/info/population/not_a_number - Bad Request", async () => {
        const url = "/api/location/info/population/not_a_number"
        const response = await request(app).get(url)
        expect(response.status).toBe(400)
    })

    it("GET | /api/location/info/population/1234 - Internal Server Error", async () => {
        const url = "/api/location/info/population/1234"
        const response = await request(app).get(url)
        expect(response.status).toBe(500)
    })

    it("GET | /api/location/info/population/3549904 - OK", async () => {
        const url = "/api/location/info/population/3549904"
        const response = await request(app).get(url)
        expect(response.status).toBe(200)
    })

    it("GET | /api/location/info/population/3549904?ano=1900 - Bad Request", async () => {
        const url = "/api/location/info/population/3549904"
        const q = {
            ano: 1900
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(400)
    })

    it("GET | /api/location/info/population/3549904?ano=2025 - OK", async () => {
        const url = "/api/location/info/population/3549904"
        const q = {
            ano: 2025
        }
        const response = await request(app).get(url).query(q)
        expect(response.status).toBe(200)
    })
})