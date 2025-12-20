
export default defineEventHandler(async (event) => {
  try {
    const checkUser = await StudentSchema.aggregate([
      {
        $lookup: {
          from: 'teachers',
          localField: 'homeroom_teacher',
          foreignField: 'idTeacher',
          as: 'teacher',
        },
      },
      { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
    ])
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