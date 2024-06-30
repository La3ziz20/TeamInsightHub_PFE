/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { Client } from './client.schema';
import { User } from './user.schema';

export const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  technology: { type: String, required: true },
  details: { type: String, required: true },
  clientId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Client', required: true },
  consultants: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true }],
  //more columns to be added here
  createDate: { type: Date, default: Date.now },
  createBy: { type: String, default: "Mohamed Aziz Manai" },//TODO: to change with the connected user
  modifyDate: { type: Date, default: Date.now },
  modifyBy: { type: String, default: "Mohamed Aziz Manai" },//TODO: to change with the connected user
}, { versionKey: false })
ProjectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProjectSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  }
});
export interface Project extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: Date;
  endDate: Date;
  technology: string;
  details: string;
  clientId: string;
  consultants: string[];
  createDate: Date;
  createBy: string;
  modifyDate: Date;
  modifyBy: string;
}
