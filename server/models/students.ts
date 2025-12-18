import { defineMongooseModel } from '#nuxt/mongoose'

export const StudentSchema = defineMongooseModel({
  name: 'Student',
  schema: {
    idSiswa: {
      type: 'String',
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
    phone_student: {
      type: 'String',
    },
    parent_phone: {
      type: 'String',
    },
    parent_name: {
      type: 'String',
    },
    homeroom_teacher: {
      type: 'String',
    },
    
  },
})