import type { Config, Context } from '@netlify/functions'
import fs from 'fs/promises'
import CloudKit from 'tsl-apple-cloudkit'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const isDevelopment = (Netlify.env.get('NETLIFY_DEV') === 'true')

export const config: Config = {
  path: '/api/scholar-age'
}

export default async (req: Request, context: Context) => {
  const recordName = context.url.searchParams.get('r')
  if (!recordName) {
    return new Response('Query parameter r is required', { status: 400 })
  }

  let connection: CloudKit.CloudKit
  try {
    connection = await setupCloudKitConnection()
  } catch (error) {
    if (typeof error === 'string') {
      return missingEnvironmentError(error as string)
    } else {
      throw error
    }
  }
  await connection.getDefaultContainer().setUpAuth()
  const database = connection.getDefaultContainer().publicCloudDatabase

  const scholarPrivate = await fetchRecord(recordName, database)
  const birthdayValue = scholarPrivate.fields['birthday'].value
  let birthday = dayjs.utc(birthdayValue)
  if (context.geo.timezone) {
    birthday = birthday.tz(context.geo.timezone)
  }
  const now = dayjs()
  const age = now.diff(birthday, 'year')

  const headers: HeadersInit = {
    'cache-control': 'max-age=86400',
  }
  if (isDevelopment) {
    headers['access-control-allow-origin'] = 'http://localhost:3000'
  }
  return Response.json({ age }, { headers })
}

async function fetchRecord(recordName: string, db: CloudKit.Database): Promise<CloudKit.RecordReceived> {
  const response = await db.fetchRecords([recordName])
  if (!response.records || !response.records[0]) {
    throw new Error(`Empty response when fetching record: ${recordName}`)
  }
  return response.records[0] as CloudKit.RecordReceived
}

function missingEnvironmentError(key: string): Response {
  console.error(`Missing environment variable ${key}`)
  return new Response(
    JSON.stringify({ message: 'Invalid configuration, check logs' }),
    { status: 500 }
  )
}

const cloudKitSTSKeyFile = '/tmp/sts-key.pem'
async function setupCloudKitConnection(): Promise<CloudKit.CloudKit> {
  checkEnvironment('CLOUDKIT_CONTAINER_IDENTIFIER')
  checkEnvironment('CLOUDKIT_ENVIRONMENT')
  checkEnvironment('CLOUDKIT_STS_KEY')
  checkEnvironment('CLOUDKIT_STS_KEY_ID')

  // Write the key to a file so CloudKit JS can read it
  const stsKey = Netlify.env.get('CLOUDKIT_STS_KEY')!
  await fs.writeFile(cloudKitSTSKeyFile, stsKey)

  const container: CloudKit.ServerContainerConfig = {
    containerIdentifier: Netlify.env.get('CLOUDKIT_CONTAINER_IDENTIFIER'),
    environment: Netlify.env.get('CLOUDKIT_ENVIRONMENT') as any,
    serverToServerKeyAuth: {
      keyID: Netlify.env.get('CLOUDKIT_STS_KEY_ID'),
      privateKeyFile: cloudKitSTSKeyFile,
      privateKeyPassPhrase: ''
    }
  } as any
  return CloudKit.configure({
    containers: [container],
    services: {
      fetch: fetch,
      logger: console
    }
  })
}

function checkEnvironment(key: string) {
  if (!Netlify.env.has(key)) {
    throw key
  }
}
