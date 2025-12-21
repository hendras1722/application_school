
export default defineEventHandler(async (event) => {
  try {
    const params    = getQuery(event)
    const checkUser = await StudentSchema.aggregate([
      {
        $match: {
          idSiswa: params.idSiswa,
        },
      },
      {
        $lookup: {
          from: 'teachers',
          localField: 'homeroom_teacher',
          foreignField: 'idTeacher',
          as: 'teacher',
        },
      },
      {
        $unwind: {
          path: '$teacher',
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    if (!checkUser) {
      return {
        code: 200,
        message: 'User not found',
        data: null
      }
    }
    return checkUser[0]
  }
  catch (error) {
    return error
  }
})