/**
 * Basic test to verify Jest setup is working
 */
describe('Jest Setup', () => {
  it('should be able to run tests', () => {
    expect(true).toBe(true)
  })

  it('should have environment variables mocked', () => {
    expect(process.env.NODE_ENV).toBe('test')
    expect(process.env.NEXTAUTH_SECRET).toBeDefined()
    expect(process.env.DATABASE_URL).toBeDefined()
  })
})
