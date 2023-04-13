import glob from 'fast-glob'
import { rollup } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

export async function build() {
  const modulePath = process.cwd()
  const files = await glob('*.{ts,tsx}', {
    cwd: modulePath,
    absolute: true,
    onlyFiles: true
  })
  const excludes = ['node_modules']
  const input = files.filter(path => !excludes.some(exclude => path.includes(exclude)))

  const reg = /\\([^\\]+)$/
  modulePath.match(reg)

  const packageJson = await import(`../packages/${RegExp.$1}/package.json`, {
    assert: { type: 'json' }
  })
  const { dependencies = {} } = packageJson

  const bundle = await rollup({
    input,
    plugins: [
      nodeResolve({
        extensions: ['.ts', '.tsx']
      }),
      vueJsx(),
      esbuild({
        sourceMap: true,
        target: 'esnext'
      })
    ],
    external: Object.keys(dependencies),
    treeshake: true
  })
  const configs = [
    { format: 'cjs', ext: 'js' },
    { format: 'esm', ext: 'mjs' }
  ] as const
  configs.forEach(config => {
    bundle.write({
      format: config.format,
      exports: config.format === 'cjs' ? 'named' : undefined,
      dir: `${modulePath}/lib`,
      preserveModules: false,
      sourcemap: true,
      entryFileNames: `[name].${config.ext}`
    })
  })
}
build()
