import dayjs from 'dayjs'

const validate = (timestamp: number): boolean => {
  const date = dayjs(timestamp)
  return date.isBefore(dayjs())
}

const message = 'The {_field_} field must be valid date before today'

export default {
  validate,
  params: [],
  message
}
