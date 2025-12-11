import { existsSync, mkdirSync } from "fs"

function createPaste(dir: string) {
    if (!existsSync(dir)) {
        mkdirSync(dir)
    }
}

export default createPaste