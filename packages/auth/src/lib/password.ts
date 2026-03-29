import { scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'

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

function bytesToHex(value: Uint8Array) {
  return Buffer.from(value).toString('hex')
}

function hexToBytes(value: string) {
  return new Uint8Array(Buffer.from(value, 'hex'))
}

function isHexString(value: string) {
  return value.length > 0 && value.length % 2 === 0 && /^[\da-f]+$/i.test(value)
}
