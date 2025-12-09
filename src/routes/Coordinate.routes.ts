import CoordinateController from "../controllers/Coordinate.controller";
import { Router } from 'express'

class CoordinateRoutes {
    private controller: CoordinateController
    private router: Router = Router()

    private readonly url = "/coordinate"
    private readonly url_uf = "/coordinate/:sigla"

    constructor() {
        this.controller = new CoordinateController()

        this.router.get(
            this.url,
            this.controller.getRandomCoord.bind(this.controller)
        )

        this.router.get(
            this.url_uf,
            this.controller.getRandomCoord.bind(this.controller)
        )
    }

    public getRouter() {
        return this.router
    }
}

const coordinateRoutes = new CoordinateRoutes().getRouter()
export default coordinateRoutes