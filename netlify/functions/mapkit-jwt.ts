import { Handler, HandlerContext, HandlerResponse } from '@netlify/functions'
import jwt from 'jsonwebtoken'
import { URL } from 'url'

const TTL = 30 * 60 // 30 minutes in seconds

const handler: Handler = async (event, context) => {
  const encodedPrivateKey = process.env.MAPKIT_PRIVATE_KEY
  if (!encodedPrivateKey?.length) {
    return missingEnvironmentError('MAPKIT_PRIVATE_KEY')
  }
  const privateKeyId = process.env.MAPKIT_PRIVATE_KEY_ID
  if (!privateKeyId?.length) {
    return missingEnvironmentError('MAPKIT_PRIVATE_KEY_ID')
  }
  const teamId = process.env.MAPKIT_TEAM_ID
  if (!teamId?.length) {
    return missingEnvironmentError('MAPKIT_TEAM_ID')
  }

  // Decode base64 encoded private key
  const privateKey = Buffer.from(encodedPrivateKey, 'base64')

  // Generate the JWT
  const payload = {
    // Issuer: Apple Developer Team Id
    iss: teamId,
    // Issued at: Current time in seconds since epoch
    iat: new Date().getTime() / 1000,
    // Expires at: Time of expiration in seconds since epoch
    exp: new Date().getTime() / 1000 + TTL,
    // Origin: Restrict JWT to specific domain names
    origin: getNetlifyFunctionHostnameFromContext(context) || 'www.wwdcscholars.com'
  }

  const header = {
    // Key Id: Apple MapKit JS Key Id
    kid: privateKeyId,
    typ: 'JWT',
    alg: 'ES256'
  }

  const token = jwt.sign(payload, privateKey, { header })
  return {
    statusCode: 200,
    body: JSON.stringify({ token })
  }
}

function missingEnvironmentError(variableName: string): HandlerResponse {
  console.error(`Missing environment variable ${variableName}`)
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Invalid configuration, check logs' })
  }
}

function getNetlifySiteURLFromContext(context: HandlerContext): string | undefined {
  if (!context.clientContext) {
    return undefined
  }

  const data = context.clientContext.custom.netlify
  const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
  return decoded.site_url
}

function getNetlifyFunctionHostnameFromContext(context: HandlerContext): string | undefined {
  const siteURL = getNetlifySiteURLFromContext(context)
  if (!siteURL) {
    return undefined
  }

  return new URL(siteURL).hostname
}

export { handler }
