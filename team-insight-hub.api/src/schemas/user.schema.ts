/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Role } from 'src/auth/enum/role.enum';
export const UserSchema = new mongoose.Schema({
     firstname: {type: String, required: true},
     lastname: {type: String, required: true},
     phone: {type: String, required: true},
     address: {type: String, required: true},
     email: {type: String, required: true},
     skils: {type: String, required: true},
     certificate: {type: String, required: true},
     password: {type: String, required: true},
     role: { type: String, enum: Object.values(Role), default: Role.CONSULTANT },
     createdAt: { type: Date, default: Date.now },
     updatedAt: { type: Date, default: Date.now },
}, { versionKey: false })
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  }
});
export interface User extends mongoose.Document {
  id: string;
  firstname: string;
  lastname: string;
  skils: string;
  certificate: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
