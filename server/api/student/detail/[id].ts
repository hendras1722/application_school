
export default defineEventHandler(async (event) => {
  try {
    const query = getRouterParam(event, 'id')
    console.log(query,'iniquery')
    const checkUser = await StudentSchema.findOne({ idSiswa: query })
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