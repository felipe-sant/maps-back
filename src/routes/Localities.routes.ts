import { Router } from "express";
import LocalitiesController from "../controllers/Localities.controller";

class LocalitiesRoutes {
    private controler: LocalitiesController
    private router: Router = Router()

    private readonly url = "/location"
    private readonly url_info_populacao = "/location/info/population/:codearea"

    constructor() {
        this.controler = new LocalitiesController()

        this.router.get(
            this.url,
            this.controler.getInfoLocation.bind(this.controler)
        )

        this.router.get(
            this.url_info_populacao,
            this.controler.getPopulacao.bind(this.controler)
        )
    }

    public getRouter() {
        return this.router
    }
}

const localitiesRoutes = new LocalitiesRoutes().getRouter()
export default localitiesRoutes