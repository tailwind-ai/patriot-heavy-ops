/**
 * Base Repository Tests
 *
 * Tests for the abstract BaseRepository class functionality
 */

import {
  BaseRepository,
  RepositoryOptions,
  FilterOptions,
  PaginationOptions,
} from "@/lib/repositories/base-repository"
import { ConsoleLogger } from "@/lib/services/base-service"

// Mock Prisma Client
const mockPrismaClient = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
} as any

// Concrete implementation for testing
class TestRepository extends BaseRepository {
  constructor(options?: RepositoryOptions) {
    super(mockPrismaClient, "TestRepository", options)
  }

  // Expose protected methods for testing
  public testCreateError = this.createError.bind(this)
  public testCreateSuccess = this.createSuccess.bind(this)
  public testHandleAsync = this.handleAsync.bind(this)
  public testValidateRequired = this.validateRequired.bind(this)
  public testLogOperation = this.logOperation.bind(this)
  public testBuildPagination = this.buildPagination.bind(this)
  public testApplyFilters = this.applyFilters.bind(this)
  public testApplyPagination = this.applyPagination.bind(this)
}

describe("BaseRepository", () => {
  let repository: TestRepository
  let mockLogger: jest.Mocked<ConsoleLogger>

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any

    repository = new TestRepository({ logger: mockLogger })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("constructor", () => {
    it("should initialize with default options", () => {
      const repo = new TestRepository()
      expect(repo.getRepositoryName()).toBe("TestRepository")
      expect(repo.isOfflineMode()).toBe(false)
    })

    it("should initialize with custom options", () => {
      const repo = new TestRepository({
        logger: mockLogger,
        enableCaching: true,
        offlineMode: true,
      })
      expect(repo.isOfflineMode()).toBe(true)
    })
  })

  describe("error handling", () => {
    it("should create standardized error result", () => {
      const result = repository.testCreateError(
        "TEST_ERROR",
        "Test error message",
        { detail: "test" }
      )

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.error?.code).toBe("TEST_ERROR")
      expect(result.error?.message).toBe("Test error message")
      expect(result.error?.details).toEqual({ detail: "test" })
      expect(result.error?.timestamp).toBeInstanceOf(Date)
      expect(mockLogger.error).toHaveBeenCalledWith(
        "TestRepository Error: Test error message",
        { code: "TEST_ERROR", details: { detail: "test" } }
      )
    })

    it("should create success result", () => {
      const testData = { id: "123", name: "test" }
      const result = repository.testCreateSuccess(testData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(testData)
      expect(result.error).toBeUndefined()
    })

    it("should create success result with pagination", () => {
      const testData = [{ id: "123" }]
      const pagination = {
        page: 1,
        limit: 10,
        total: 1,
        hasNext: false,
        hasPrev: false,
      }
      const result = repository.testCreateSuccess(testData, pagination)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(testData)
      expect(result.pagination).toEqual(pagination)
    })
  })

  describe("async operation handling", () => {
    it("should handle successful async operations", async () => {
      const mockOperation = jest.fn().mockResolvedValue("success")

      const result = await repository.testHandleAsync(
        mockOperation,
        "TEST_ERROR",
        "Test error",
        "testOperation"
      )

      expect(result.success).toBe(true)
      expect(result.data).toBe("success")
      expect(mockLogger.info).toHaveBeenCalledWith(
        "TestRepository: testOperation",
        undefined
      )
    })

    it("should handle failed async operations", async () => {
      const mockError = new Error("Database error")
      const mockOperation = jest.fn().mockRejectedValue(mockError)

      const result = await repository.testHandleAsync(
        mockOperation,
        "DB_ERROR",
        "Database operation failed"
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("DB_ERROR")
      expect(result.error?.message).toBe("Database operation failed")
      expect(result.error?.details?.originalError).toBe("Database error")
    })

    it("should handle Prisma client errors", async () => {
      const prismaError = new Error("Unique constraint failed")
      prismaError.name = "PrismaClientKnownRequestError"
      ;(prismaError as any).code = "P2002"

      const mockOperation = jest.fn().mockRejectedValue(prismaError)

      const result = await repository.testHandleAsync(
        mockOperation,
        "PRISMA_ERROR",
        "Prisma operation failed"
      )

      expect(result.success).toBe(false)
      expect(result.error?.details?.prismaCode).toBe("P2002")
    })
  })

  describe("validation", () => {
    it("should validate required parameters successfully", () => {
      const params = { id: "123", name: "test", email: "test@example.com" }
      const result = repository.testValidateRequired(params, ["id", "name"])

      expect(result.success).toBe(true)
    })

    it("should fail validation for missing parameters", () => {
      const params = { id: "123", name: "" }
      const result = repository.testValidateRequired(params, [
        "id",
        "name",
        "email",
      ])

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe("VALIDATION_ERROR")
      expect(result.error?.details?.missingFields).toEqual(["name", "email"])
    })

    it("should fail validation for null/undefined parameters", () => {
      const params = { id: "123", name: null, email: undefined }
      const result = repository.testValidateRequired(params, [
        "id",
        "name",
        "email",
      ])

      expect(result.success).toBe(false)
      expect(result.error?.details?.missingFields).toEqual(["name", "email"])
    })
  })

  describe("pagination", () => {
    it("should build pagination metadata correctly", () => {
      const pagination = repository.testBuildPagination(2, 10, 25)

      expect(pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        hasNext: true,
        hasPrev: true,
      })
    })

    it("should handle first page pagination", () => {
      const pagination = repository.testBuildPagination(1, 10, 25)

      expect(pagination?.hasPrev).toBe(false)
      expect(pagination?.hasNext).toBe(true)
    })

    it("should handle last page pagination", () => {
      const pagination = repository.testBuildPagination(3, 10, 25)

      expect(pagination?.hasPrev).toBe(true)
      expect(pagination?.hasNext).toBe(false)
    })
  })

  describe("query building", () => {
    it("should apply filters to base query", () => {
      const baseQuery = { where: { active: true } }
      const filters: FilterOptions = {
        where: { name: "test" },
        orderBy: { createdAt: "desc" },
        include: { user: true },
        select: { id: true, name: true },
      }

      const result = repository.testApplyFilters(baseQuery, filters)

      expect(result).toEqual({
        where: { active: true, name: "test" },
        orderBy: { createdAt: "desc" },
        include: { user: true },
        select: { id: true, name: true },
      })
    })

    it("should apply pagination to base query", () => {
      const baseQuery = { where: { active: true } }
      const pagination: PaginationOptions = {
        page: 2,
        limit: 10,
      }

      const result = repository.testApplyPagination(baseQuery, pagination)

      expect(result).toEqual({
        where: { active: true },
        take: 10,
        skip: 10,
      })
    })

    it("should apply cursor-based pagination", () => {
      const baseQuery = { where: { active: true } }
      const pagination: PaginationOptions = {
        cursor: "cursor123",
        limit: 10,
      }

      const result = repository.testApplyPagination(baseQuery, pagination)

      expect(result).toEqual({
        where: { active: true },
        take: 10,
        cursor: { id: "cursor123" },
        skip: 1,
      })
    })
  })

  describe("configuration methods", () => {
    it("should get repository name", () => {
      expect(repository.getRepositoryName()).toBe("TestRepository")
    })

    it("should manage caching setting", () => {
      repository.setCaching(true)
      // Note: We can't directly test this as it's internal state
      // but we can verify the method exists and doesn't throw
      expect(() => repository.setCaching(false)).not.toThrow()
    })

    it("should manage offline mode", () => {
      expect(repository.isOfflineMode()).toBe(false)
      repository.setOfflineMode(true)
      expect(repository.isOfflineMode()).toBe(true)
    })
  })

  describe("logging", () => {
    it("should log operations", () => {
      repository.testLogOperation("test operation", { userId: "123" })

      expect(mockLogger.info).toHaveBeenCalledWith(
        "TestRepository: test operation",
        { userId: "123" }
      )
    })
  })
})
