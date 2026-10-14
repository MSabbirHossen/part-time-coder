import { Schema, model, Document, Types } from 'mongoose';

// -----------------------------------------------------------------------------
// 1. Company Model (Singleton pattern from BACKEND_SCHEMA.md)
// -----------------------------------------------------------------------------
export interface ICompany extends Document {
  code: string;
  name: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CompanySchema = new Schema<ICompany>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
  },
  { timestamps: true }
);

export const Company = model<ICompany>('Company', CompanySchema);

// -----------------------------------------------------------------------------
// 2. ClientOrganization Model (Client boundary from BACKEND_SCHEMA.md)
// -----------------------------------------------------------------------------
export interface IClientOrganization extends Document {
  companyId: Types.ObjectId;
  code: string;
  name: string;
  status: 'active' | 'suspended' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export const ClientOrganizationSchema = new Schema<IClientOrganization>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'suspended', 'archived'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

// Compound unique index ensuring organization code is unique per operating company
ClientOrganizationSchema.index({ companyId: 1, code: 1 }, { unique: true });

export const ClientOrganization = model<IClientOrganization>(
  'ClientOrganization',
  ClientOrganizationSchema
);

// -----------------------------------------------------------------------------
// 3. Project Model (Scoped client entity with optimistic concurrency version)
// -----------------------------------------------------------------------------
export interface IProject extends Document {
  companyId: Types.ObjectId;
  clientOrganizationId: Types.ObjectId;
  code: string;
  name: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  version: number;
  budgetMinorUnits: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = new Schema<IProject>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    clientOrganizationId: {
      type: Schema.Types.ObjectId,
      ref: 'ClientOrganization',
      required: true,
      index: true,
    },
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'completed', 'cancelled'],
      default: 'draft',
      index: true,
    },
    version: { type: Number, required: true, default: 1 },
    budgetMinorUnits: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
  },
  { timestamps: true }
);

// Compound index guaranteeing project code uniqueness within a client organization
ProjectSchema.index(
  { companyId: 1, clientOrganizationId: 1, code: 1 },
  { unique: true }
);

export const Project = model<IProject>('Project', ProjectSchema);

// -----------------------------------------------------------------------------
// 4. User Model (Firebase Identity to Database Authorization binding)
// -----------------------------------------------------------------------------
export interface IUser extends Document {
  companyId: Types.ObjectId;
  firebaseUid: string;
  email: string;
  status: 'active' | 'suspended' | 'invited';
  role: 'owner' | 'admin' | 'staff' | 'client';
  clientOrganizationId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUser>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'suspended', 'invited'],
      default: 'active',
      index: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'staff', 'client'],
      required: true,
    },
    clientOrganizationId: {
      type: Schema.Types.ObjectId,
      ref: 'ClientOrganization',
      index: true,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
