
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)

    // 1. Cek user di auth service
    const checkAuthUser = await $fetch(
      `${config.public.baseURL}/api/auth/check-email`,
      {
        method: 'POST',
        body: { email: body.email },
      }
    )

    let userId: string

    // 2. Kalau user auth belum ada → register
    if (checkAuthUser.message === 'User not found') {
      const register = await $fetch(
        `${config.public.baseURL}/api/auth/register`,
        {
          method: 'POST',
          body: {
            email: body.email,
            password: body.nisn,
          },
        }
      )

      userId = register.data.id
    } else {
      userId = checkAuthUser.data._id
    }

    // 3. Kalau student sudah ada → return langsung
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
