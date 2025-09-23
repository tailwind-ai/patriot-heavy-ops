/**
 * Repository Factory Tests
 * 
 * Tests for the RepositoryFactory dependency injection system
 */

import { RepositoryFactory } from "@/lib/repositories"
import { ServiceRequestRepository } from "@/lib/repositories/service-request-repository"
import { UserRepository } from "@/lib/repositories/user-repository"

// Mock the default db import
jest.mock("@/lib/db", () => ({
  db: {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

// Get reference to the mocked db for testing
const mockDatabase = require("@/lib/db").db

describe("RepositoryFactory", () => {
  beforeEach(() => {
    RepositoryFactory.reset()
    jest.clearAllMocks()
  })

  afterEach(() => {
    RepositoryFactory.reset()
  })

  describe("singleton pattern", () => {
    it("should return the same ServiceRequestRepository instance", () => {
      const repo1 = RepositoryFactory.getServiceRequestRepository()
      const repo2 = RepositoryFactory.getServiceRequestRepository()

      expect(repo1).toBe(repo2)
      expect(repo1).toBeInstanceOf(ServiceRequestRepository)
    })

    it("should return the same UserRepository instance", () => {
      const repo1 = RepositoryFactory.getUserRepository()
      const repo2 = RepositoryFactory.getUserRepository()

      expect(repo1).toBe(repo2)
      expect(repo1).toBeInstanceOf(UserRepository)
    })

    it("should create new instances after reset", () => {
      const repo1 = RepositoryFactory.getServiceRequestRepository()
      RepositoryFactory.reset()
      const repo2 = RepositoryFactory.getServiceRequestRepository()

      expect(repo1).not.toBe(repo2)
      expect(repo2).toBeInstanceOf(ServiceRequestRepository)
    })
  })

  describe("database management", () => {
    it("should use default database by default", () => {
      const db = RepositoryFactory.getDatabase()
      expect(db).toBe(mockDatabase)
    })

    it("should use custom database when set", () => {
      const customDb = { custom: true } as any
      RepositoryFactory.setDatabase(customDb)

      const db = RepositoryFactory.getDatabase()
      expect(db).toBe(customDb)
    })

    it("should reset repositories when database changes", () => {
      const repo1 = RepositoryFactory.getServiceRequestRepository()
      
      const customDb = { custom: true } as any
      RepositoryFactory.setDatabase(customDb)
      
      const repo2 = RepositoryFactory.getServiceRequestRepository()
      expect(repo1).not.toBe(repo2)
    })
  })

  describe("factory methods", () => {
    it("should create new ServiceRequestRepository with default database", () => {
      const repo = RepositoryFactory.createServiceRequestRepository()
      
      expect(repo).toBeInstanceOf(ServiceRequestRepository)
      expect(repo).not.toBe(RepositoryFactory.getServiceRequestRepository())
    })

    it("should create new ServiceRequestRepository with custom database", () => {
      const customDb = { custom: true } as any
      const repo = RepositoryFactory.createServiceRequestRepository(customDb)
      
      expect(repo).toBeInstanceOf(ServiceRequestRepository)
    })

    it("should create new UserRepository with default database", () => {
      const repo = RepositoryFactory.createUserRepository()
      
      expect(repo).toBeInstanceOf(UserRepository)
      expect(repo).not.toBe(RepositoryFactory.getUserRepository())
    })

    it("should create new UserRepository with custom database", () => {
      const customDb = { custom: true } as any
      const repo = RepositoryFactory.createUserRepository(customDb)
      
      expect(repo).toBeInstanceOf(UserRepository)
    })

    it("should create repositories with custom options", () => {
      const options = { enableCaching: true, offlineMode: true }
      const repo = RepositoryFactory.createServiceRequestRepository(undefined, options)
      
      expect(repo).toBeInstanceOf(ServiceRequestRepository)
      expect(repo.isOfflineMode()).toBe(true)
    })
  })

  describe("initialization", () => {
    it("should initialize all repositories and connect to database", async () => {
      mockDatabase.$connect.mockResolvedValue(undefined)

      await RepositoryFactory.initialize()

      expect(mockDatabase.$connect).toHaveBeenCalled()
      
      // Verify repositories are created
      const serviceRepo = RepositoryFactory.getServiceRequestRepository()
      const userRepo = RepositoryFactory.getUserRepository()
      
      expect(serviceRepo).toBeInstanceOf(ServiceRequestRepository)
      expect(userRepo).toBeInstanceOf(UserRepository)
    })

    it("should handle database connection errors", async () => {
      const connectionError = new Error("Connection failed")
      mockDatabase.$connect.mockRejectedValue(connectionError)

      await expect(RepositoryFactory.initialize()).rejects.toThrow("Connection failed")
    })
  })

  describe("cleanup", () => {
    it("should disconnect from database and reset repositories", async () => {
      mockDatabase.$disconnect.mockResolvedValue(undefined)

      // Create some repositories first
      RepositoryFactory.getServiceRequestRepository()
      RepositoryFactory.getUserRepository()

      await RepositoryFactory.cleanup()

      expect(mockDatabase.$disconnect).toHaveBeenCalled()
      
      // Verify repositories are reset (new instances created)
      const newServiceRepo = RepositoryFactory.getServiceRequestRepository()
      const newUserRepo = RepositoryFactory.getUserRepository()
      
      expect(newServiceRepo).toBeInstanceOf(ServiceRequestRepository)
      expect(newUserRepo).toBeInstanceOf(UserRepository)
    })

    it("should handle disconnect errors gracefully", async () => {
      const disconnectError = new Error("Disconnect failed")
      mockDatabase.$disconnect.mockRejectedValue(disconnectError)

      // Should not throw, but should still reset
      await expect(RepositoryFactory.cleanup()).resolves.toBeUndefined()
    })

    it("should cleanup custom database", async () => {
      const customDb = {
        $disconnect: jest.fn().mockResolvedValue(undefined),
      } as any

      RepositoryFactory.setDatabase(customDb)
      await RepositoryFactory.cleanup()

      expect(customDb.$disconnect).toHaveBeenCalled()
    })
  })

  describe("convenience functions", () => {
    it("should provide convenience function for getting service requests", () => {
      const mockRepo = {
        findManyWithRoleAccess: jest.fn(),
      } as any

      // Mock the factory method
      jest.spyOn(RepositoryFactory, 'getServiceRequestRepository').mockReturnValue(mockRepo)

      const { repositories } = require("@/lib/repositories")
      repositories.getServiceRequests("user123", "USER")

      expect(mockRepo.findManyWithRoleAccess).toHaveBeenCalledWith({
        userId: "user123",
        userRole: "USER",
      })
    })

    it("should provide convenience function for creating service requests", () => {
      const mockRepo = {
        create: jest.fn(),
      } as any

      jest.spyOn(RepositoryFactory, 'getServiceRequestRepository').mockReturnValue(mockRepo)

      const { repositories } = require("@/lib/repositories")
      const createData = { title: "Test", userId: "user123" } as any
      repositories.createServiceRequest(createData)

      expect(mockRepo.create).toHaveBeenCalledWith(createData)
    })

    it("should provide convenience function for getting user by ID", () => {
      const mockRepo = {
        findById: jest.fn(),
      } as any

      jest.spyOn(RepositoryFactory, 'getUserRepository').mockReturnValue(mockRepo)

      const { repositories } = require("@/lib/repositories")
      repositories.getUserById("user123")

      expect(mockRepo.findById).toHaveBeenCalledWith("user123")
    })

    it("should provide convenience function for getting user by email", () => {
      const mockRepo = {
        findByEmail: jest.fn(),
      } as any

      jest.spyOn(RepositoryFactory, 'getUserRepository').mockReturnValue(mockRepo)

      const { repositories } = require("@/lib/repositories")
      repositories.getUserByEmail("user@example.com")

      expect(mockRepo.findByEmail).toHaveBeenCalledWith("user@example.com")
    })

    it("should provide convenience function for creating users", () => {
      const mockRepo = {
        create: jest.fn(),
      } as any

      jest.spyOn(RepositoryFactory, 'getUserRepository').mockReturnValue(mockRepo)

      const { repositories } = require("@/lib/repositories")
      const userData = { email: "user@example.com" } as any
      repositories.createUser(userData)

      expect(mockRepo.create).toHaveBeenCalledWith(userData)
    })

    it("should provide convenience function for updating users", () => {
      const mockRepo = {
        update: jest.fn(),
      } as any

      jest.spyOn(RepositoryFactory, 'getUserRepository').mockReturnValue(mockRepo)

      const { repositories } = require("@/lib/repositories")
      const updateData = { name: "Updated Name" } as any
      repositories.updateUser("user123", updateData)

      expect(mockRepo.update).toHaveBeenCalledWith("user123", updateData)
    })

    it("should provide convenience function for getting available operators", () => {
      const mockRepo = {
        findAvailableOperators: jest.fn(),
      } as any

      jest.spyOn(RepositoryFactory, 'getUserRepository').mockReturnValue(mockRepo)

      const { repositories } = require("@/lib/repositories")
      const filters = { preferredLocations: ["Texas"] }
      repositories.getAvailableOperators(filters)

      expect(mockRepo.findAvailableOperators).toHaveBeenCalledWith(filters)
    })
  })
})
