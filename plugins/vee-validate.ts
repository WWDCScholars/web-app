import { extend, localize } from 'vee-validate'
import { email, max, min, required } from 'vee-validate/dist/rules'
import { dateBeforeToday, dimensions, imageOrString, required_image, url } from '~/util/validation'
import en from 'vee-validate/dist/locale/en.json'

extend('email', email)
extend('max', max)
extend('min', min)
extend('required', required)
extend('dateBeforeToday', dateBeforeToday)
extend('dimensions', dimensions)
extend('imageOrString', imageOrString)
// phoneOrEmail added at point of use becase it imports quite large phone dependency
extend('required_image', required_image)
extend('url', url)

localize({ en })
