import UFs from "../const/UFs"

function getRandomState(): number {
    const uf = UFs[Math.floor(Math.random() * UFs.length)]
    return uf.codigo
}

export default getRandomState