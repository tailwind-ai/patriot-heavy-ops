/**
 * Dashboard Docker Integration Tests
 *
 * Docker-based integration testing for dashboard functionality.
 * Tests complete system integration in containerized environment.
 */

import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

describe("Dashboard Docker Integration Tests", () => {
  const DOCKER_COMPOSE_FILE = "docker-compose.test.yml"
  const TEST_TIMEOUT = 300000 // 5 minutes

  beforeAll(async () => {
    // Start Docker services
    await execAsync(`docker-compose -f ${DOCKER_COMPOSE_FILE} up -d`)

    // Wait for services to be ready
    await new Promise((resolve) => setTimeout(resolve, 30000))
  }, TEST_TIMEOUT)

  afterAll(async () => {
    // Clean up Docker services
    await execAsync(`docker-compose -f ${DOCKER_COMPOSE_FILE} down -v`)
  }, TEST_TIMEOUT)

  describe("Database Integration", () => {
    it("should connect to test database", async () => {
      try {
        const { stdout } = await execAsync(
          "docker-compose -f docker-compose.test.yml exec -T postgres-test pg_isready -U test_user -d patriot_heavy_ops_test"
        )
        expect(stdout).toContain("accepting connections")
      } catch (error) {
        throw new Error(`Database connection failed: ${error}`)
      }
    })

    it("should run database migrations", async () => {
      try {
        const { stdout } = await execAsync(
          "docker-compose -f docker-compose.test.yml exec -T app-test npx prisma migrate deploy"
        )
        expect(stdout).toContain("migrated")
      } catch (error) {
        throw new Error(`Database migration failed: ${error}`)
      }
    })
  })

  describe("Redis Integration", () => {
    it("should connect to test Redis", async () => {
      try {
        const { stdout } = await execAsync(
          "docker-compose -f docker-compose.test.yml exec -T redis-test redis-cli ping"
        )
        expect(stdout).toContain("PONG")
      } catch (error) {
        throw new Error(`Redis connection failed: ${error}`)
      }
    })
  })

  describe("Application Integration", () => {
    it("should start application in Docker", async () => {
      try {
        const { stdout } = await execAsync(
          "docker-compose -f docker-compose.test.yml ps app-test"
        )
        expect(stdout).toContain("Up")
      } catch (error) {
        throw new Error(`Application container check failed: ${error}`)
      }
    })

    it("should run integration tests in Docker", async () => {
      try {
        const { stdout } = await execAsync(
          "docker-compose -f docker-compose.test.yml exec -T app-test npm run test:integration"
        )
        expect(stdout).toContain("PASS")
      } catch (error) {
        throw new Error(`Integration test execution failed: ${error}`)
      }
    })
  })

  describe("Service Health Checks", () => {
    it("should verify all services are healthy", async () => {
      try {
        const { stdout } = await execAsync(
          "docker-compose -f docker-compose.test.yml ps"
        )

        // Check that all services are running
        expect(stdout).toContain("postgres-test")
        expect(stdout).toContain("redis-test")
        expect(stdout).toContain("app-test")
      } catch (error) {
        throw new Error(`Service health check failed: ${error}`)
      }
    })
  })
})
