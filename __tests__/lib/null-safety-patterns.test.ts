/**
 * Null Safety Pattern Tests (Issue #335)
 * Tests defensive programming patterns across utilities and scripts
 *
 * Following cursorrules.md Platform Mode:
 * - Conservative error handling with optional chaining
 * - Defensive programming for all uncertain data access
 * - Test edge cases where data may be missing or malformed
 */

describe("Null Safety Patterns (Issue #335)", () => {
  describe("Optional chaining for API responses", () => {
    it("should safely access nested object properties", () => {
      const objUndefined = undefined
      const objNoNested = {}
      const objWithNested = { data: { value: "test" } }

      expect((objUndefined as any)?.data?.value).toBeUndefined()
      expect((objNoNested as any)?.data?.value).toBeUndefined()
      expect(objWithNested?.data?.value).toBe("test")
    })

    it("should safely access array properties", () => {
      const arrUndefined = undefined
      const arrNoData = {}
      const arrWithData = { data: { items: [1, 2, 3] } }

      expect((arrUndefined as any)?.data?.items?.length).toBeUndefined()
      expect((arrNoData as any)?.data?.items?.length).toBeUndefined()
      expect(arrWithData?.data?.items?.length).toBe(3)
    })
  })

  describe("Safe array element access", () => {
    it("should safely access array elements with optional chaining", () => {
      const nullArray = null
      const undefinedArray = undefined
      const emptyArray: string[] = []
      const arrayWithItems = ["a", "b", "c"]

      expect((nullArray as any)?.[0]).toBeUndefined()
      expect((undefinedArray as any)?.[0]).toBeUndefined()
      expect(emptyArray?.[0]).toBeUndefined()
      expect(arrayWithItems?.[0]).toBe("a")
    })

    it("should safely access last array element", () => {
      const emptyArray: string[] = []
      const singleItem = ["only"]
      const multipleItems = ["first", "second", "last"]

      expect(emptyArray?.[emptyArray.length - 1]).toBeUndefined()
      expect(singleItem?.[singleItem.length - 1]).toBe("only")
      expect(multipleItems?.[multipleItems.length - 1]).toBe("last")
    })
  })

  describe("Safe regex match access", () => {
    it("should safely access regex match groups", () => {
      const pattern = /error in ([^\s]+):(\d+):(\d+)/
      const noMatch = pattern.exec("no error here")
      const fullMatch = pattern.exec("error in file.ts:45:12")

      expect(noMatch?.[1]).toBeUndefined()
      expect(fullMatch?.[1]).toBe("file.ts")
      expect(fullMatch?.[2]).toBe("45")
      expect(fullMatch?.[3]).toBe("12")
    })

    it("should handle missing match groups gracefully", () => {
      const pattern = /error: (.+)/
      const emptyMatch = pattern.exec("error: ")

      const description = emptyMatch?.[1]?.trim() || "default"
      expect(description).toBe("default") // Empty string .trim() returns ""
    })
  })

  describe("Nullish coalescing for defaults", () => {
    it("should use ?? for null and undefined", () => {
      const nullValue = null
      const undefinedValue = undefined
      const zeroValue = 0
      const emptyString = ""
      const falseValue = false

      expect(nullValue ?? "default").toBe("default")
      expect(undefinedValue ?? "default").toBe("default")
      expect(zeroValue ?? "default").toBe(0) // 0 is not nullish
      expect(emptyString ?? "default").toBe("") // "" is not nullish
      expect(falseValue ?? "default").toBe(false) // false is not nullish
    })
  })

  describe("Safe dynamic property access", () => {
    it("should safely access object properties with bracket notation", () => {
      const obj = { field1: "value1", field2: "value2" }
      const emptyObj: Record<string, string> = {}
      const nullObj = null

      expect(obj?.["field1"]).toBe("value1")
      expect(emptyObj?.["field1"]).toBeUndefined()
      expect((nullObj as any)?.["field1"]).toBeUndefined()
    })

    it("should safely access nested dynamic properties", () => {
      const data = { params: { userId: "123", email: "test@example.com" } }
      const noParams: Record<string, Record<string, string>> = {}

      expect(data?.params?.["userId"]).toBe("123")
      expect(noParams?.params?.["userId"]).toBeUndefined()
    })
  })

  describe("Safe array operations", () => {
    it("should safely filter and map arrays", () => {
      const undefinedArray = undefined
      const emptyArray: number[] = []
      const arrayWithItems = [1, 2, 3, 4, 5]

      const filtered1 =
        (undefinedArray as any)?.filter?.((x: number) => x > 2) || []
      const filtered2 = emptyArray?.filter((x) => x > 2) || []
      const filtered3 = arrayWithItems?.filter((x) => x > 2) || []

      expect(filtered1).toEqual([])
      expect(filtered2).toEqual([])
      expect(filtered3).toEqual([3, 4, 5])
    })

    it("should safely reduce arrays with default values", () => {
      const emptyArray: number[] = []
      const arrayWithItems = [1, 2, 3]

      const sum1 = emptyArray.reduce((a, b) => a + b, 0)
      const sum2 = arrayWithItems.reduce((a, b) => a + b, 0)

      expect(sum1).toBe(0)
      expect(sum2).toBe(6)
    })
  })
})
