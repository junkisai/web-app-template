const PASSWORD_HASH_PREFIX = 'pbkdf2-sha256'
const PASSWORD_HASH_VERSION = 'v1'
const PASSWORD_HASH_ITERATIONS = 2_000
const PASSWORD_HASH_LENGTH = 32
const PASSWORD_SALT_LENGTH = 16

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_LENGTH))
  const derivedKey = await deriveKey(password, salt, PASSWORD_HASH_ITERATIONS)

  return [
    PASSWORD_HASH_PREFIX,
    PASSWORD_HASH_VERSION,
    String(PASSWORD_HASH_ITERATIONS),
    toBase64Url(salt),
    toBase64Url(derivedKey),
  ].join('$')
}

export async function verifyPassword(input: {
  hash: string
  password: string
}) {
  const parsedHash = parsePasswordHash(input.hash)

  if (!parsedHash) {
    console.warn('Unsupported password hash format encountered.', {
      prefix: input.hash.split('$')[0] ?? '<empty>',
    })

    return false
  }

  const derivedKey = await deriveKey(
    input.password,
    parsedHash.salt,
    parsedHash.iterations,
  )

  return constantTimeEqual(derivedKey, parsedHash.hash)
}

async function deriveKey(
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
    PASSWORD_HASH_LENGTH * 8,
  )

  return new Uint8Array(derivedBits)
}

function parsePasswordHash(value: string) {
  const [prefix, version, iterations, salt, hash] = value.split('$')

  if (
    prefix !== PASSWORD_HASH_PREFIX ||
    version !== PASSWORD_HASH_VERSION ||
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

function toBase64Url(value: Uint8Array) {
  return Buffer.from(value).toString('base64url')
}

function fromBase64Url(value: string) {
  return new Uint8Array(Buffer.from(value, 'base64url'))
}

function toArrayBuffer(value: Uint8Array) {
  return new Uint8Array(value).buffer
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false
  }

  let result = 0

  for (let index = 0; index < left.length; index += 1) {
    result |= left[index]! ^ right[index]!
  }

  return result === 0
}

const textEncoder = new TextEncoder()
