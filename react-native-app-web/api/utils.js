export function throwIfError(response, data) {
  if (response.status >= 400) {
    if (data.errors && data.errors.length) {
      throw { message: data.errors[0].message }
    }
    throw { message: 'Ocorreu um erro inesperado' }
  }
}
