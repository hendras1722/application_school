
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const checkUser = await UserSchema.findOne({
      email: body.email,
    })

    if (!checkUser) {
     setResponseStatus(event, 404, 'User not found')
     return
    }
    setResponseStatus(event, 200)
    return checkUser
  }
  catch (error) {
    return error
  }
})