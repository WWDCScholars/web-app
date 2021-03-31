import { RuleParamSchema } from 'vee-validate/dist/types/types'
import { email } from 'vee-validate/dist/rules'
import phone from 'phone'
const validate = (subject: string): Promise<boolean> => {
  return new Promise(resolve => {
    const phoneNumber = phone(subject) // returns an empty array when not a valid number
    const isValidPhone = phoneNumber.length == 2
    const isValidEmail = email.validate(subject)
    resolve(isValidPhone || isValidEmail)
  })
}

const params: RuleParamSchema[] = []

const message = 'The {_field_} field must be a valid phone number or email address'

export default {
  validate,
  params,
  message
}
