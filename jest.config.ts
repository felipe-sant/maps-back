import { Config } from "jest"
import { createDefaultPreset } from "ts-jest"
import path from "path"

const tsJestTransformCfg = createDefaultPreset().transform

const config: Config = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFiles: [path.resolve(__dirname, "test/setup.ts")],
}

export default config
