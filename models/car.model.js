import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    make: { 
      type: String, 
      required: true,
      trim: true
    },
    model: { 
      type: String, 
      required: true,
      trim: true
    },
    year: { 
      type: Number, 
      required: true,
      min: 1990,
      max: new Date().getFullYear() + 1
    },
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    mileage: { 
      type: Number,
      default: 0,
      min: 0
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Petrol'
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'Semi-Automatic'],
      default: 'Manual'
    },
    color: {
      type: String,
      default: 'White'
    },
    description: {
      type: String,
      maxlength: 1000
    },
    images: [{
      type: String
    }],
    features: [{
      type: String
    }],
    inStock: {
      type: Boolean,
      default: true
    },
    sold: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', carSchema);
export default Car;