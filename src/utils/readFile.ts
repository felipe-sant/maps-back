import { readFileSync } from "fs";

function readFile(caminho: string): string | undefined {
    try {
        return readFileSync(caminho, "utf-8");
    } catch {
        return undefined
    }
}

export default readFile