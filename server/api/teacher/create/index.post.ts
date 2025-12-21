
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  try {
    const body               = await readBody(event)
    const checkAvailableUser = await $fetch(`${config.public.BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      body: {
        email: body.email,
      },
    })

    if (checkAvailableUser.message === 'User not found') {
      const register = await $fetch(`${config.public.BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: {
          email: body.email,
          password: body.nik,
        },
      })

      const obj = body

      const user = await new UserSchema({
        email: body.email,
        role: body.role,
      }).save()

      await new TeacherSchema({
        idTeacher: user._id,
        ...obj,
      }).save()

      return register
    }
    const checkUser = await TeacherSchema.findOne({
      email: body.email,
    })

    if (!checkUser){
      const obj = body

      const checkUserRegister = await UserSchema.findOne({
        email: body.email,
      })
      if (!checkUserRegister){
        const user = await new UserSchema({
          email: body.email,
          role: body.role,
        }).save()
        await new TeacherSchema({
          idTeacher: user._id,
          ...obj,
        }).save()
        
        return user
      }

      await new TeacherSchema({
        idTeacher: checkUserRegister?._id,
        ...obj,
      }).save()

      return checkUser
    }
  }
  catch (error) {
    console.log(error.message)
    return error
  }
})