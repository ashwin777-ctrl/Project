import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['electronics', 'documents', 'pets', 'accessories', 'other']
    },
    imageUrl: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coords) => coords.length === 2,
          message: 'Location must contain longitude and latitude.'
        }
      }
    },
    status: { type: String, enum: ['lost', 'found', 'claimed'], default: 'lost' }
  },
  { timestamps: true }
);

itemSchema.index({ location: '2dsphere' });
itemSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Item', itemSchema);
