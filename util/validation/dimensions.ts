import { RuleParamSchema, ValidationMessageGenerator } from 'vee-validate/dist/types/types'

const validateImage = (file: File, minWidth: number, maxWidth: number, minHeight: number, maxHeight: number): Promise<boolean> => {
  const URL = window.URL || (window as any).webkitURL

  return new Promise(resolve => {
    const image = new Image()
    image.onerror = () => resolve(false)
    image.onload = () => {
      if ((minWidth > -1 && image.width < minWidth)
        || (maxWidth > -1 && image.width > maxWidth)
        || (minHeight > -1 && image.height < minHeight)
        || (maxHeight > -1 && image.height > maxHeight)) {
        return resolve(false)
      }
      resolve(true)
    }

    image.src = URL.createObjectURL(file)
  })
}

const validate = (files: string | File | File[], { minWidth, maxWidth, minHeight, maxHeight }: Record<string, any>) => {
  if (typeof files === 'string') {
    return Promise.resolve(true)
  }

  const list: File[] = []
  files = Array.isArray(files) ? files : [files]
  for (let i = 0; i < files.length; i++) {
    // if file is not an image, reject.
    if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
      return Promise.resolve(false)
    }

    list.push(files[i])
  }

  return Promise.all(list.map(file => validateImage(file, minWidth, maxWidth, minHeight, maxHeight))).then (values => {
    return values.every(v => v)
  })
}

const params: RuleParamSchema[] = [{
    name: 'minWidth',
    cast(value) {
      return Number(value)
    }
  }, {
    name: 'maxWidth',
    cast(value) {
      return Number(value)
    }
  }, {
    name: 'minHeight',
    cast(value) {
      return Number(value)
    }
  }, {
    name: 'maxHeight',
    cast(value) {
      return Number(value)
    }
  }]

const message: ValidationMessageGenerator = (field, params) => {
  let message = `The ${field} field `
  if (!params) {
    return message + 'could not be validated'
  }

  if (params.minWidth > -1 && params.minHeight > -1 && params.maxWidth > -1 && params.maxHeight > -1) {
    return message + `must have a resolution between ${params.minWidth}x${params.minHeight} and ${params.maxWidth}x${params.maxHeight} pixels`
  }

  if (params.minWidth > -1 && params.minHeight > -1) {
    return message + `must have a minimum resolution of ${params.minWidth}x${params.minHeight} pixels`
  }

  if (params.maxWidth > -1 && params.maxHeight > -1) {
    return message + `must have a maximum resolution of ${params.maxWidth}x${params.maxHeight} pixels`
  }

  return message + 'could not be validated'
}

export default {
  validate,
  params,
  message
}
