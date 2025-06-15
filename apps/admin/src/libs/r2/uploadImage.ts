import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${crypto.randomUUID()}_${file.name}`
  const arrayBuffer = await file.arrayBuffer()

  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT ?? '',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY ?? '',
      secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_KEY ?? '',
    },
  })

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME ?? '',
      Key: fileName,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
      ACL: 'public-read',
    }),
  )

  return `${process.env.NEXT_PUBLIC_R2_BUCKET_URL}/${fileName}`
}
