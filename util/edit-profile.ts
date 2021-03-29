export async function handleSave(form: any, formData: object, $nuxt: any, saveFunction: (changes: object) => Promise<void>) {
  const changes = formChanges(form, formData)

    $nuxt.$loading.start()
    try {
      await saveFunction(changes)
      form.reset()
      $nuxt.$loading.finish()
    } catch (e) {
      console.error(e)
      $nuxt.$loading.fail()
    }
}

function formChanges (form: object, formData: object) {
  return (Object.values(form['fields']) as any[])
    .filter(f => {
      return (f.dirty && Array.isArray(formData[f.id])) // array fields only get the dirty flag
        || f.changed // other fields get the changed flag
    })
    .reduce((acc, field) => {
      acc[field.id] = { value: formData[field.id] }
      return acc
    }, {})
}
