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
// 4. User Model (P00 Architectural Feasibility Model)
// -----------------------------------------------------------------------------
/**
 * @fileoverview P00 Feasibility User Model
 *
 * IMPORTANT ARCHITECTURAL NOTE:
 * This User schema is strictly an interim P00 feasibility fixture designed
 * to validate Mongoose connection lifecycles, database constraints, indexing,
 * transactions, and tenant company isolation.
 *
 * It must NOT be mistaken for the final production multi-role scoped RBAC model.
 *
 * In accordance with ADR-0004 ("Firebase Authentication and Database-Backed Scoped RBAC")
 * and docs/BACKEND_SCHEMA.md, Phase P02 (IMP-02-01 / IMP-02-02) will replace this
 * simple single-role field with granular, document-level and organization-level
 * scoped RBAC data structures (e.g., RoleGrant, explicit project memberships,
 * fine-grained permissions, and dynamic client/internal role bindings).
 */
export interface IUser extends Document {
  companyId: Types.ObjectId;
  firebaseUid: string;
  email: string;
  status: 'active' | 'suspended' | 'invited';
  /**
   * Single role enum for P00 feasibility tests only.
   * Final multi-role, project-scoped RBAC will be implemented in P02.
   */
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
