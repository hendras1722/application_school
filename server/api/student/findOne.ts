
export default defineEventHandler(async (event) => {
  try {
    const params    = getQuery(event)
    const checkUser = await StudentSchema.findOne({
      email: params.email,
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