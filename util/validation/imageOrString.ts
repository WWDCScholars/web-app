import { RuleParamSchema, ValidationMessageTemplate } from 'vee-validate/dist/types/types'

const validate = (files: File | string | (File | string)[]) => {
  const regex = /\.(jpg|jpeg|png)$/i

  if (typeof files === 'string') {
    return true
  }

  if (Array.isArray(files)) {
    return files
      .filter(file => typeof file !== 'string')
      .every(file => regex.test((file as File).name))
  }

  // else File
  return regex.test((files as File).name)
}

const params: RuleParamSchema[] = []

const message: ValidationMessageTemplate = (fieldName, placeholders) => {
  if (placeholders?.value && Array.isArray(placeholders.value)) {
    return `The ${fieldName} can only contain images`
  } else {
    return `The ${fieldName} can only contain an image`
  }

}

export default {
  computesRequired: true,
  validate,
  params,
  message
}
