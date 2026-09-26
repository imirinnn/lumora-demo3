import mongoose from 'mongoose';

export const PROJECT_TYPES = ['Residential', 'Commercial', 'Hospitality', 'Consultation'];
export const BUDGETS = ['Under ₹10 Lakhs', '₹10–25 Lakhs', '₹25–50 Lakhs', '₹50 Lakhs+'];
export const STATUSES = ['New', 'Contacted', 'Completed'];

const consultationSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: 120,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Email is not valid'],
    },
    phone: { type: String, required: [true, 'Phone is required'], trim: true, maxlength: 20 },
    projectType: { type: String, required: true, enum: PROJECT_TYPES },
    location: { type: String, required: [true, 'Location is required'], trim: true, maxlength: 120 },
    budget: { type: String, required: true, enum: BUDGETS },
    message: { type: String, required: [true, 'Message is required'], trim: true, minlength: 10, maxlength: 2000 },
    status: { type: String, enum: STATUSES, default: 'New', index: true },
    // Outcome of the email alert sent to the studio team (see services/notifyNewConsultation.js)
    notification: {
      sent: { type: Boolean },
      provider: { type: String },
      detail: { type: String },
      at: { type: Date },
    },
  },
  { timestamps: true } // adds createdAt + updatedAt
);

consultationSchema.index({ createdAt: -1 });

consultationSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
