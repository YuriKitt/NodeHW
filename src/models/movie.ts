import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description: string;
  releaseDate: Date;
  genre: string[];
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: [String], required: true }
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
