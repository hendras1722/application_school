import { defineMongooseModel } from '#nuxt/mongoose'

export const UserSchema = defineMongooseModel({
  name: 'User',
  schema: {
    email: {
      type: 'string',
      required: true,
    },
    role: {
      type: 'string',
      enum: ['teacher', 'student', 'admin'],
    },
  },
})