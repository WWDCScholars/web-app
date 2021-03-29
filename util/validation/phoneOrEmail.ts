import { RuleParamSchema } from 'vee-validate/dist/types/types'
import { email } from 'vee-validate/dist/rules'
import PhoneNumber from 'awesome-phonenumber'

const validate = (subject: string): Promise<boolean> => {
  return new Promise(resolve => {
    const phone = new PhoneNumber(subject)
    const isValidPhone = !!phone.isValid()
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
