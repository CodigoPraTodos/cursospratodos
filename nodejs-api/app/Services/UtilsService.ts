const DEFAULT_PAGE_SIZE = 10
const MAXIMUM_PAGE_SIZE = 100

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

  public static getPageAndLimit({ page, limit }: { page?: any; limit?: any }) {
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    return {
      page: !page || isNaN(page) ? 1 : page,
      limit:
        !limit || isNaN(limit) || limit > MAXIMUM_PAGE_SIZE
          ? DEFAULT_PAGE_SIZE
          : limit,
    }
  }
}
