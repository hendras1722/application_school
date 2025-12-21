
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)

    // 1. Cek user di auth service
    const checkAuthUser = await $fetch(
      `${config.public.BASE_URL}/api/auth/check-email`,
      {
        method: 'POST',
        body: { email: body.email },
      }
    )

    let userId: string

    // if (checkAuthUser.message === 'User not found') {
      // await $fetch(
      //   `${config.public.baseURL}/api/auth/register`,
      //   {
      //     method: 'POST',
      //     body: {
      //       email: body.email,
      //       password: body.nisn,
      //     },
      //   }
      // )

      userId = body.idSiswa
    // } else {
    //   userId = checkAuthUser.data._id
    // }

    const existingStudent = await StudentSchema.findOne({
      email: body.email,
    })

    if (existingStudent) {
      return existingStudent
    }
    console.log(userId)

    // 4. Buat student baru
    const student = await new StudentSchema({
      ...body,
      idSiswa: userId,
      role: 'student',
    }).save()

    return student
  } catch (error) {
    throw error
  }
})
