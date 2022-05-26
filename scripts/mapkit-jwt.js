import fs from 'fs'
import jwt from 'jsonwebtoken'
import process from 'process'

function main() {
  const args = process.argv

  for (const stringIndex in process.argv) {
    const index = Number(stringIndex)
    const arg = args[index]

    if (arg === 'generate') {
      command_generate(args.slice(index + 1))
      return
    }
    if (arg === 'peek') {
      command_peek(args.slice(index + 1))
      return
    }
  }

  console.error('Invalid use of command. Usage: yarn run admin:mapkit-jwt:generate or yarn run admin:mapkit-jwt:peek')
  process.exit(1)
}

function command_generate(args) {
  const TTL = 1 * 365 * 24 * 60 * 60 // 1 year in seconds
  const options = {
    teamId: args[0],
    keyId: args[1],
    origin: undefined,
    keyPath: undefined
  }

  if (args.length === 3) {
    options.keyPath = args[2]
  } else if (args.length === 4) {
    options.origin = args[2]
    options.keyPath = args[3]
  } else {
    console.error('Invalid use of command. Usage: yarn run admin:mapkit-jwt:generate <TEAM_ID> <KEY_ID> [ORIGIN] <KEY_PATH>')
    process.exit(1)
  }

  // Read private key file
  const privateKey = fs.readFileSync(options.keyPath, 'utf-8').trim()

  // Generate the JWT
  const payload = {
    iss: options.teamId,            /** Issuer: Apple Developer Team Id */
    iat: new Date().getTime() / 1000,         /** Issued at: Current time in seconds since epoch */
    exp: new Date().getTime() / 1000 + TTL,   /** Expires at: Time of expiration in seconds since epoch */
    origin: options.origin          /** Origin: Restrict JWT to specific FQDNs */
  }

  const header = {
    kid: options.keyId, /** Key Id: Apple MapKit JS Key Id */
    typ: 'JWT',
    alg: 'ES256'
  }

  const token = jwt.sign(payload, privateKey, { header })
  console.log(token)
}

function command_peek(args) {
  if (args.length !== 1) {
    console.error('Invalid use of command. Usage: yarn run admin:mapkit-jwt:peek <MAPKIT_JWT>')
    process.exit(1)
  }

  const decoded = jwt.decode(args[0])

  console.log('Team Id:', decoded.iss)
  console.log('Issued at:', new Date(decoded.iat * 1000))
  console.log('Expires:', new Date(decoded.exp * 1000))
  console.log('Origin:', decoded.origin)
}

main()
