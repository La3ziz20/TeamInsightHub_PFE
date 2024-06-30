/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  createBy: { type: String, default: 'Mohamed Aziz Manai' }, //TODO: to change with the connected user
  modifyDate: { type: Date, default: Date.now },
  modifyBy: { type: String, default: 'Mohamed Aziz Manai' },//TODO: to change with the connected user

}, { versionKey: false })
ClientSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ClientSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  }
});
export interface Client extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  address: string;
  email: string;
  createDate: Date;
  createBy: string;
  modifyDate: Date;
  modifyBy: string;
}




