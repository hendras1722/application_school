
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    const filter: Record<string, any> = {}

    if (query.to) {
      filter.to = { $in: [query.to, 'all'] }
    }

    const announcements = await AnnouncementSchema.find(filter).sort({ created_at: -1 }) 

    return announcements
  }
  catch (error) {
    return error
  }
})