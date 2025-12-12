process.env.DOTENV_CONFIG_QUIET = "true"

import dotenv from "dotenv"
dotenv.config()

import createPaste from "../src/utils/createPaste"
createPaste(".cache/")