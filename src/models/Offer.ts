import mongoose, {Schema, Document} from "mongoose";

export interface OfferDoc extends Document {
  offerType : string;
  vendors : [any];
  title : string;
  description : string;
  minValue : number;
  offerAmount : number;
  startValidity : Date;
  endValidity : Date; 
  promocode : string;
  bank : [any];
  bins : [any];
  pincode : string;
  isActive : boolean;
}

const OfferSchema = new Schema({
  offerType : {type : String, required : true},
  vendors : [{type : Schema.Types.ObjectId, ref : "Vendor"}],
  title : {type : String, required : true},
  description : {type : String},
  minValue : {type : Number, required : true},
  offerAmount : {type : Number, required : true},
  startValidity : {type : Date, required : true},
  endValidity : Date,
  promocode : {type : String, required : true},
  bank : {type : String},
  bins : {type : Number},
  pincode : {type : String, required : true},
  isActive : {type : Boolean, required : true},
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

const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);

export {Offer};