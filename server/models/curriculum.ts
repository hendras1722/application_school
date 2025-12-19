import { defineMongooseModel } from '#nuxt/mongoose'

export const CurriculumSchema = defineMongooseModel({
  name: 'Curriculum',
  schema: {
    name: {
      type: 'string',
      required: true,
    },
    class: {
      type: 'string',
      required: true,
    },
  },
})