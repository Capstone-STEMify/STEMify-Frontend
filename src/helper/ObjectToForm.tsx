export function objectToFormData(obj: any): FormData {
  const formData = new FormData()
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      for (const subKey in obj[key]) {
        formData.append(`${key}.${subKey}`, obj[key][subKey])
      }
    } else {
      formData.append(key, obj[key])
    }
  }
  return formData
}
