import pino from 'pino'

async function main() {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'dd-mm-yyyy HH:MM:ss',
        ignore: 'pid,hostname',
        colorize: false,
      },
    },
  })

  const domains = process.env.DOMAINS
  const token = process.env.TOKEN

  if (!domains) {
    logger.error('Error: Missing DOMAINS env var')
    process.exit(1)
  }
  if (!token) {
    logger.error('Error: Missing TOKEN env var')
    process.exit(1)
  }

  const url = `https://www.duckdns.org/update?domains=${domains}&token=${token}&verbose=true&ip=`

  try {
    const res = await fetch(url)
    const resText = await res.text()
    const [status, ipv4, ipv6, action] = resText.split('\n')
    logger.info(JSON.stringify({ status, ipv4, ipv6, action }))
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

main()
