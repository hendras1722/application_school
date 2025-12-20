export default defineEventHandler(async (event) => {
  try {
    const params    = getQuery(event)
    const checkUser = await TeacherSchema.findOne({
      idTeacher: params.id,
    })
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