import mongoose, {Schema, Document} from "mongoose";

export interface FoodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: string;
  price: number;
  rating: number;
  images: [string];
}

const FoodSchema: Schema = new Schema({
  vendorId: {type: String, required: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  category: {type: String},
  foodType: {type: String, required: true},
  readyTime: {type: Number},
  price: {type: Number},
  rating: {type: Number},
  images: {type: [String]},
},{
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
    // versionKey: false,
  },
  timestamps: true,
})

const Food = mongoose.model<FoodDoc>("food", FoodSchema);
export {Food};