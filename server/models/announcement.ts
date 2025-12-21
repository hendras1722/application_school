import { defineMongooseModel } from '#nuxt/mongoose'

export const AnnouncementSchema = defineMongooseModel({
  name: 'Announcement',
  schema: {
    to: {
      type: 'string',
      required: true,
    },
    message: {
      type: 'string',
      required: true,
    },
  },
  options: {
    timestamps: {
      createdAt: 'created_at',
    },
  },
})