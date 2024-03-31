import { RuleParamSchema } from 'vee-validate/dist/types/types'

const validate = (subject: string) => {
  try {
    new URL(subject)
  } catch {
    return false
  }

  return true
}

const params: RuleParamSchema[] = []

const message = 'The {_field_} field must be a valid URL'

export default {
  validate,
  params,
  message
}
