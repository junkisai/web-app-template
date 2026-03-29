import { scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'

const LEGACY_PASSWORD_HASH_PREFIX = 'pbkdf2-sha256'
const LEGACY_PASSWORD_HASH_VERSION = 'v1'
const LEGACY_PASSWORD_HASH_LENGTH = 32
const PASSWORD_SALT_LENGTH = 16

const SCRYPT_KEY_LENGTH = 64
const SCRYPT_OPTIONS = {
  N: 16_384,
  r: 16,
  p: 1,
  maxmem: 128 * 16_384 * 16 * 2,
} as const

export async function hashPassword(password: string) {
  const salt = bytesToHex(
    crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_LENGTH)),
  )
  const derivedKey = await deriveScryptKey(password, salt)

  return `${salt}:${bytesToHex(derivedKey)}`
}

export async function verifyPassword(input: {
  hash: string
  password: string
}) {
  // Keep existing PBKDF2 users working while new hashes move back to scrypt.
  if (isLegacyPbkdf2Hash(input.hash)) {
    return verifyLegacyPassword(input)
  }

  const parsedHash = parseScryptHash(input.hash)

  if (!parsedHash) {
    console.warn('Unsupported password hash format encountered.', {
      prefix: input.hash.split(':')[0] ?? '<empty>',
    })

    return false
  }

  const derivedKey = await deriveScryptKey(input.password, parsedHash.salt)

  return timingSafeEqual(Buffer.from(derivedKey), Buffer.from(parsedHash.hash))
}

async function deriveScryptKey(password: string, salt: string) {
  const normalizedPassword = password.normalize('NFKC')

  return new Promise<Uint8Array>((resolve, reject) => {
    scryptCallback(
      normalizedPassword,
      salt,
      SCRYPT_KEY_LENGTH,
      SCRYPT_OPTIONS,
      (error, derivedKey) => {
        if (error) {
          reject(error)
          return
        }

        resolve(new Uint8Array(derivedKey))
      },
    )
  })
}

function parseScryptHash(value: string) {
  const [salt, hash, ...rest] = value.split(':')

  if (!salt || !hash || rest.length > 0) {
    return null
  }

  if (!isHexString(salt) || !isHexString(hash)) {
    return null
  }

  return {
    salt,
    hash: hexToBytes(hash),
  }
}

function isLegacyPbkdf2Hash(value: string) {
  return value.startsWith(`${LEGACY_PASSWORD_HASH_PREFIX}$`)
}

async function verifyLegacyPassword(input: { hash: string; password: string }) {
  const parsedHash = parseLegacyPasswordHash(input.hash)

  if (!parsedHash) {
    console.warn('Unsupported legacy password hash format encountered.', {
      prefix: input.hash.split('$')[0] ?? '<empty>',
    })

    return false
  }

  const derivedKey = await deriveLegacyKey(
    input.password,
    parsedHash.salt,
    parsedHash.iterations,
  )

  return timingSafeEqual(Buffer.from(derivedKey), Buffer.from(parsedHash.hash))
}

async function deriveLegacyKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: toArrayBuffer(salt),
      iterations,
    },
    keyMaterial,
    LEGACY_PASSWORD_HASH_LENGTH * 8,
  )

  return new Uint8Array(derivedBits)
}

function parseLegacyPasswordHash(value: string) {
  const [prefix, version, iterations, salt, hash] = value.split('$')

  if (
    prefix !== LEGACY_PASSWORD_HASH_PREFIX ||
    version !== LEGACY_PASSWORD_HASH_VERSION ||
    !iterations ||
    !salt ||
    !hash
  ) {
    return null
  }

  const iterationCount = Number.parseInt(iterations, 10)

  if (!Number.isFinite(iterationCount) || iterationCount <= 0) {
    return null
  }

  try {
    return {
      iterations: iterationCount,
      salt: fromBase64Url(salt),
      hash: fromBase64Url(hash),
    }
  } catch {
    return null
  }
}

function bytesToHex(value: Uint8Array) {
  return Buffer.from(value).toString('hex')
}

function hexToBytes(value: string) {
  return new Uint8Array(Buffer.from(value, 'hex'))
}

function isHexString(value: string) {
  return value.length > 0 && value.length % 2 === 0 && /^[\da-f]+$/i.test(value)
}

function fromBase64Url(value: string) {
  return new Uint8Array(Buffer.from(value, 'base64url'))
}

function toArrayBuffer(value: Uint8Array) {
  return new Uint8Array(value).buffer
}

const textEncoder = new TextEncoder()
