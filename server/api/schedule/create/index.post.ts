import { ScheduleSchema } from "~~/server/models/course"

export default defineEventHandler(async (event) => {
  try {
    const body      = await readBody(event)
    const addCourse = await new ScheduleSchema(body).save()
    return addCourse
  }
  catch (error) {
    return error
  }
})