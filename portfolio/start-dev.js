import { createServer } from 'vite'

// Change cwd to portfolio dir so PostCSS/Tailwind resolves configs correctly
process.chdir(import.meta.dirname)

const server = await createServer({
  server: { host: true, port: 5173 },
})
await server.listen()
server.printUrls()
