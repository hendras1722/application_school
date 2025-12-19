
export default defineEventHandler(async (event) => {
  try {
    const body          = await readBody(event)
    const addCurriculum = await new CurriculumSchema(body).save()
    return addCurriculum
  }
  catch (error) {
    return error
  }
})