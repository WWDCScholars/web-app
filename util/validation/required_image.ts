import { RuleParamSchema } from 'vee-validate/dist/types/types'

const validate = (files: any) => {
  return files !== null && files !== undefined
}

const params: RuleParamSchema[] = []

const message = 'The {_field_} field is required'

export default {
  computesRequired: true,
  validate,
  params,
  message
}
