import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose, { Types } from 'mongoose';
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
  getDatabaseState,
  Company,
  ClientOrganization,
  Project,
  User,
} from './index';

describe('Database Feasibility & Schema Invariants (IMP-00-06)', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  }, 60000); // 60s timeout for in-memory replica set spin-up

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('Connection Lifecycle and State Reporting', () => {
    it('verifies in-memory replica set is connected with readyState 1', () => {
      const state = getDatabaseState();
      expect(state.isConnected).toBe(true);
      expect(state.readyState).toBe(1);
      expect(state.host).toBeDefined();
    });

    it('gracefully handles connection failure with non-routable URI without hanging', async () => {
      const testConn = mongoose.createConnection();
      await expect(
        testConn.openUri('mongodb://127.0.0.1:27999/unreachable_db', {
          serverSelectionTimeoutMS: 1000,
          connectTimeoutMS: 1000,
        })
      ).rejects.toThrow();
      await testConn.close();
    });
  });

  describe('Key Schema Constraints & Mongoose Validation', () => {
    it('enforces required fields and type validations on Company model', async () => {
      // Missing code and name
      const invalidCompany = new Company({});
      await expect(invalidCompany.validate()).rejects.toThrowError(/Path `code` is required/);
    });

    it('enforces enum constraints on User role and status', async () => {
      const companyId = new Types.ObjectId();
      const invalidUser = new User({
        companyId,
        firebaseUid: 'test_uid_123',
        email: 'test@example.com',
        role: 'invalid_role_name',
        status: 'active',
      });

      await expect(invalidUser.validate()).rejects.toThrowError(/`invalid_role_name` is not a valid enum value/);
    });

    it('enforces currency code uppercase transformation and budget non-negative constraint', async () => {
      const company = await Company.create({
        code: 'PTC',
        name: 'Part-time Coder LLC',
        currency: 'usd',
      });
      expect(company.currency).toBe('USD');

      const clientOrg = await ClientOrganization.create({
        companyId: company._id,
        code: 'CLI-01',
        name: 'Client Alpha',
      });

      const invalidProject = new Project({
        companyId: company._id,
        clientOrganizationId: clientOrg._id,
        code: 'PRJ-NEG',
        name: 'Negative Budget Project',
        budgetMinorUnits: -500, // Invalid: min is 0
      });

      await expect(invalidProject.validate()).rejects.toThrowError(/budgetMinorUnits/);
    });
  });

  describe('Unique and Compound Index Constraints', () => {
    it('enforces unique index on Company code', async () => {
      await Company.create({ code: 'PTC-UNIQUE', name: 'Company 1' });

      // Attempting to create duplicate company code
      await expect(
        Company.create({ code: 'PTC-UNIQUE', name: 'Company 2 Duplicate' })
      ).rejects.toThrowError(/E11000 duplicate key error/);
    });

    it('enforces compound unique index on ClientOrganization ({ companyId, code })', async () => {
      const company1 = await Company.create({ code: 'COMP-1', name: 'Company 1' });
      const company2 = await Company.create({ code: 'COMP-2', name: 'Company 2' });

      // Same client code under Company 1
      await ClientOrganization.create({
        companyId: company1._id,
        code: 'CLIENT-X',
        name: 'Client X Corp',
      });

      // Duplicate under same company MUST fail
      await expect(
        ClientOrganization.create({
          companyId: company1._id,
          code: 'CLIENT-X',
          name: 'Client X Duplicate',
        })
      ).rejects.toThrowError(/E11000 duplicate key error/);

      // Same client code under different company (Company 2) MUST succeed
      const org2 = await ClientOrganization.create({
        companyId: company2._id,
        code: 'CLIENT-X',
        name: 'Client X under Company 2',
      });
      expect(org2._id).toBeDefined();
    });

    it('enforces compound unique index on Project ({ companyId, clientOrganizationId, code })', async () => {
      const company = await Company.create({ code: 'COMP-P', name: 'Company P' });
      const orgA = await ClientOrganization.create({
        companyId: company._id,
        code: 'ORG-A',
        name: 'Org A',
      });
      const orgB = await ClientOrganization.create({
        companyId: company._id,
        code: 'ORG-B',
        name: 'Org B',
      });

      await Project.create({
        companyId: company._id,
        clientOrganizationId: orgA._id,
        code: 'WEB-APP',
        name: 'Web Application for Org A',
        budgetMinorUnits: 1000000,
      });

      // Duplicate code under same orgA MUST fail
      await expect(
        Project.create({
          companyId: company._id,
          clientOrganizationId: orgA._id,
          code: 'WEB-APP',
          name: 'Duplicate Web App',
          budgetMinorUnits: 500000,
        })
      ).rejects.toThrowError(/E11000 duplicate key error/);

      // Same code under orgB MUST succeed
      const projB = await Project.create({
        companyId: company._id,
        clientOrganizationId: orgB._id,
        code: 'WEB-APP',
        name: 'Web Application for Org B',
        budgetMinorUnits: 2000000,
      });
      expect(projB._id).toBeDefined();
    });
  });

  describe('Client Organization Isolation & Scoped Querying', () => {
    it('strictly isolates projects by clientOrganizationId', async () => {
      const company = await Company.create({ code: 'PTC-MAIN', name: 'Main Co' });
      const client1 = await ClientOrganization.create({
        companyId: company._id,
        code: 'CLIENT-1',
        name: 'First Client',
      });
      const client2 = await ClientOrganization.create({
        companyId: company._id,
        code: 'CLIENT-2',
        name: 'Second Client',
      });

      await Project.create({
        companyId: company._id,
        clientOrganizationId: client1._id,
        code: 'P1-C1',
        name: 'Confidential Client 1 Project',
        budgetMinorUnits: 500000,
      });

      await Project.create({
        companyId: company._id,
        clientOrganizationId: client2._id,
        code: 'P2-C2',
        name: 'Confidential Client 2 Project',
        budgetMinorUnits: 800000,
      });

      // Query scoped to Client 1 must return ONLY Client 1's project
      const client1Projects = await Project.find({
        companyId: company._id,
        clientOrganizationId: client1._id,
      });
      expect(client1Projects).toHaveLength(1);
      expect(client1Projects[0]?.code).toBe('P1-C1');

      // Query scoped to Client 2 must return ONLY Client 2's project
      const client2Projects = await Project.find({
        companyId: company._id,
        clientOrganizationId: client2._id,
      });
      expect(client2Projects).toHaveLength(1);
      expect(client2Projects[0]?.code).toBe('P2-C2');

      // Attempting to query Client 1's project ID with Client 2 scope returns null
      const crossTenantProbe = await Project.findOne({
        _id: client1Projects[0]?._id,
        clientOrganizationId: client2._id,
      });
      expect(crossTenantProbe).toBeNull();
    });
  });

  describe('Multi-Document ACID Transactions on Replica Set', () => {
    it('successfully commits cross-collection writes in an atomic transaction', async () => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const company = new Company({ code: 'TX-CO', name: 'Transaction Co' });
        await company.save({ session });

        const client = new ClientOrganization({
          companyId: company._id,
          code: 'TX-CLI',
          name: 'Transaction Client',
        });
        await client.save({ session });

        await session.commitTransaction();
      } finally {
        await session.endSession();
      }

      // Verify records are persisted after commit
      const persistedCompany = await Company.findOne({ code: 'TX-CO' });
      expect(persistedCompany).not.toBeNull();
      const persistedClient = await ClientOrganization.findOne({ code: 'TX-CLI' });
      expect(persistedClient).not.toBeNull();
    });

    it('rolls back all writes if an error occurs during transaction', async () => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const company = new Company({ code: 'ROLLBACK-CO', name: 'Rollback Co' });
        await company.save({ session });

        // Simulate an intentional error
        throw new Error('Forced transaction failure');
      } catch {
        await session.abortTransaction();
      } finally {
        await session.endSession();
      }

      // Verify company was NOT persisted
      const probe = await Company.findOne({ code: 'ROLLBACK-CO' });
      expect(probe).toBeNull();
    });
  });

  describe('Disposable Data Cleanup Verification', () => {
    it('confirms clearTestDatabase removes all records cleanly between tests', async () => {
      await Company.create({ code: 'TEMP-CO', name: 'Temporary Co' });
      expect(await Company.countDocuments()).toBe(1);

      await clearTestDatabase();
      expect(await Company.countDocuments()).toBe(0);
    });
  });
});
