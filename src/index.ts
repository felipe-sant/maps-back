import app from "./app"
import createPaste from "./utils/createPaste"

const port = 3001

createPaste(".cache/")

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ | Servidor rodando na porta http://0.0.0.0:${port}`)
})