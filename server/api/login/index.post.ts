
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const res  = await event.$fetch('/api/auth/login', {
      method: 'POST',
      body,
    })
    
    const checkUser = await UserSchema.findOne({
      email: body.email,
    })

    if (!checkUser){
      await new UserSchema({
        email: body.email,
        role: 'student',
      }).save()
    }
    setCookie(event, 'token', res.data.token)
    return res
  }
  catch (error) {
    return error
  }
})