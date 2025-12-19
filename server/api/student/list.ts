
export default defineEventHandler(async (event) => {
  try {
    const checkUser = await StudentSchema.find()
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