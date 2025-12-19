
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    const filter: Record<string, any> = {}

    if (query.class) {
      filter.class = query.class
    }

    const schedules = await ScheduleSchema.find(filter)

    return schedules
  }
  catch (error) {
    return error
  }
})