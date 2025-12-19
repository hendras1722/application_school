import { defineMongooseModel } from '#nuxt/mongoose'

export const ScheduleSchema = defineMongooseModel({
  name: 'schedule',
  schema: {
    name: {
      type: 'string',
      required: true,
    },
    class: {
      type: 'string',
      required: true,
    },
    course: {
      type: 'string',
      required: true,
    },
    fromTime: {
      type: 'string',
      required: true,
    },
    toTime: {
      type: 'string',
      required: true,
    },
  },
})