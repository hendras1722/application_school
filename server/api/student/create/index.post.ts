
export default defineEventHandler(async (event) => {
  try {
    const body    = await readBody(event)
    const addUser = await new StudentSchema(body).save()
    return addUser
  }
  catch (error) {
    return error
  }
})