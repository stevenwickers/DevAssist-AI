import { spawn } from 'node:child_process'

const processes = [
  {
    name: 'api',
    command: 'npm',
    args: ['run', 'dev:api'],
  },
  {
    name: 'web',
    command: 'npm',
    args: ['run', 'dev:web'],
  },
]

const children = processes.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  child.on('exit', (code, signal) => {
    if (code === 0 || signal) {
      return
    }

    console.error(`[${name}] exited with code ${code}`)
    shutdown(code ?? 1)
  })

  return child
})

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM')
    }
  }

  process.exit(code)
}

process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())
