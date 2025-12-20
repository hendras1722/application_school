import { defineMongooseModel } from '#nuxt/mongoose'

export const TeacherSchema = defineMongooseModel({
  name: 'Teacher',
  schema: {
    idTeacher: {
      type: 'string',
      ref: 'User',
      required: true,
    },
    email: {
      type: 'string',
      ref: 'User',
    },
    name: {
      type: 'string',
    },
    updated_at: {
      type: 'String',
    },
    created_at: {
      type: 'String',
    },
    class: {
      type: 'String',
    },
    status: {
      type: 'String', // keluar, aktif, tidak aktif
    },
    slug: {
      type: 'string',
      unique: true,
    },
    address: {
      type: 'String',
    },
    phone: {
      type: 'String',
    },
  },
})