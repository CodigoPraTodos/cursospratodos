import Env from '@ioc:Adonis/Core/Env'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'

import FileService from './FileService'

const IS_PROD = process.env.NODE_ENV === 'production'

export default class AwsService {
  public static Client = IS_PROD ? new S3({
    accessKeyId: Env.getOrFail('AWS_ACCESS_KEY_ID') as string,
    secretAccessKey: Env.getOrFail('AWS_SECRET_ACCESS_KEY') as string,
  }) : null

  public static async uploadFile(file: MultipartFileContract): Promise<string> {
    if (!IS_PROD || !AwsService.Client) {
      throw new Error('You should not upload files to AWS in Development mode')
    }

    const params: S3.PutObjectRequest = {
      Bucket: Env.getOrFail('AWS_FILE_UPLOAD_BUCKET') as string,
      Key: FileService.getFileName(file),
      Body: fs.createReadStream(file.filePath!),
    }

    const { Location } = await AwsService.Client.upload(params).promise()
    return Location
  }
}
