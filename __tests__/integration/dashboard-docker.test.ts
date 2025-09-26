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
      const { stdout } = await execAsync(
        "docker-compose -f docker-compose.test.yml exec postgres-test pg_isready -U test_user -d patriot_heavy_ops_test"
      )
      expect(stdout).toContain("accepting connections")
    })

    it("should run database migrations", async () => {
      const { stdout } = await execAsync(
        "docker-compose -f docker-compose.test.yml exec app-test npx prisma migrate deploy"
      )
      expect(stdout).toContain("migrated")
    })
  })

  describe("Redis Integration", () => {
    it("should connect to test Redis", async () => {
      const { stdout } = await execAsync(
        "docker-compose -f docker-compose.test.yml exec redis-test redis-cli ping"
      )
      expect(stdout).toContain("PONG")
    })
  })

  describe("Application Integration", () => {
    it("should start application in Docker", async () => {
      const { stdout } = await execAsync(
        "docker-compose -f docker-compose.test.yml ps app-test"
      )
      expect(stdout).toContain("Up")
    })

    it("should run integration tests in Docker", async () => {
      const { stdout } = await execAsync(
        "docker-compose -f docker-compose.test.yml exec app-test npm run test:integration"
      )
      expect(stdout).toContain("PASS")
    })
  })

  describe("Service Health Checks", () => {
    it("should verify all services are healthy", async () => {
      const { stdout } = await execAsync(
        "docker-compose -f docker-compose.test.yml ps"
      )

      // Check that all services are running
      expect(stdout).toContain("postgres-test")
      expect(stdout).toContain("redis-test")
      expect(stdout).toContain("app-test")
    })
  })
})
