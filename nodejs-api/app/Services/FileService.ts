import { v4 as uuid } from 'uuid'
import Env from '@ioc:Adonis/Core/Env'
import Application from '@ioc:Adonis/Core/Application'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

import AwsService from './AwsService'

export default class FileService {
  public static async uploadFile(file: MultipartFileContract): Promise<string> {
    if (process.env.NODE_ENV === 'production') {
      return await AwsService.uploadFile(file)
    }

    const path = Application.makePath('..', 'uploads')
    const fileName = FileService.getFileName(file)

    await file.move(path, {
      name: fileName,
    })

    const host = Env.get('HOST') as string
    const port = Env.get('PORT') as string

    return `http://${host}:${port}/${fileName}`
  }

  public static getFileName(file: MultipartFileContract): string {
    return `${uuid()}.${file.extname}`
  }
}
