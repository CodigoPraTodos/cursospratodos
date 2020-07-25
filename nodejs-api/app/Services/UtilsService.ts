export default class UtilsService {
  /**
   * Use Adonis pattern to format messages in an error array
   * @param {string[]} messages
   */
  public static formatMessages(...messages: string[]) {
    return {
      errors: messages.map((message) => ({
        message,
      })),
    }
  }
}
