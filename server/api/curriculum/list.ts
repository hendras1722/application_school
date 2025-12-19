export default defineEventHandler(async (event) => {
  try {
    const { class: class_ } = getQuery(event)
    if (class_){
      const resList = await CurriculumSchema.find({ class: class_ })
      return resList
    }
    const res = await CurriculumSchema.find()
    return res
  } catch (error) {
    console.log(error)
    return []
  }
})