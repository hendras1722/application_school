
export default defineEventHandler(async (event) => {
  try {
    const checkUser = await TeacherSchema.find()
    if (!checkUser) {
      return {
        code: 200,
        message: 'User not found',
        data: null
      }
    }
    return checkUser
  }
  catch (error) {
    return error
  }
})