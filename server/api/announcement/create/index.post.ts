import { AnnouncementSchema } from "~~/server/models/announcement"

export default defineEventHandler(async (event) => {
  try {
    const body            = await readBody(event)
    const addAnnouncement = await new AnnouncementSchema(body).save()
    return addAnnouncement
  }
  catch (error) {
    return error
  }
})