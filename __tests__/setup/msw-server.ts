import { setupServer } from 'msw/node'
import { handlers } from './msw-handlers'

/**
 * MSW server for mocking external API calls during testing
 */
export const server = setupServer(...handlers)

/**
 * Setup MSW server for testing
 */
export function setupMswServer() {
  // Start server before all tests
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  // Reset handlers after each test
  afterEach(() => {
    server.resetHandlers()
  })

  // Clean up after all tests
  afterAll(() => {
    server.close()
  })
}
