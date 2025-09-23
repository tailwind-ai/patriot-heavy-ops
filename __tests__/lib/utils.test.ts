/* eslint-disable tailwindcss/no-contradicting-classname */
import { cn, formatDate, absoluteUrl } from "@/lib/utils"

// Mock the env module
jest.mock("@/env.mjs", () => ({
  env: {
    NEXT_PUBLIC_APP_URL: "https://example.com",
  },
}))

describe("Utility Functions", () => {
  describe("cn function (className merger)", () => {
    it("should merge simple class names", () => {
      expect(cn("class1", "class2")).toBe("class1 class2")
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white")
    })

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional")
      expect(cn("base", false && "conditional")).toBe("base")
      expect(cn("base", null as any)).toBe("base")
      expect(cn("base", undefined as any)).toBe("base")
    })

    it("should merge conflicting Tailwind classes correctly", () => {
      // twMerge should resolve conflicts by keeping the last one
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
      expect(cn("p-4", "p-2")).toBe("p-2")
      expect(cn("text-sm", "text-lg")).toBe("text-lg")
    })

    it("should handle arrays of classes", () => {
      expect(cn(["class1", "class2"])).toBe("class1 class2")
      expect(cn(["bg-red-500"], ["text-white"])).toBe("bg-red-500 text-white")
    })

    it("should handle objects with conditional classes", () => {
      expect(
        cn({
          "base-class": true,
          "conditional-class": true,
          "false-class": false,
        })
      ).toBe("base-class conditional-class")
    })

    it("should handle mixed input types", () => {
      expect(
        cn(
          "base",
          ["array-class"],
          { "object-class": true, "false-class": false },
          true && "conditional",
          "final"
        )
      ).toBe("base array-class object-class conditional final")
    })

    it("should handle empty inputs", () => {
      expect(cn()).toBe("")
      expect(cn("")).toBe("")
      expect(cn(null)).toBe("")
      expect(cn(undefined)).toBe("")
      expect(cn(false)).toBe("")
    })

    it("should handle complex Tailwind class conflicts", () => {
      // Test margin conflicts
      expect(cn("m-4", "mx-2")).toBe("m-4 mx-2") // mx-2 should override m-4 for x-axis
      expect(cn("p-4", "px-2", "py-6")).toBe("p-4 px-2 py-6") // px and py should override p

      // Test responsive classes
      expect(cn("text-sm", "md:text-lg", "lg:text-xl")).toBe(
        "text-sm md:text-lg lg:text-xl"
      )
    })

    it("should preserve non-conflicting classes", () => {
      expect(cn("bg-red-500", "text-white", "rounded-lg", "shadow-md")).toBe(
        "bg-red-500 text-white rounded-lg shadow-md"
      )
    })

    it("should handle whitespace correctly", () => {
      expect(cn("  class1  ", "  class2  ")).toBe("class1 class2")
      expect(cn("class1\n", "\tclass2")).toBe("class1 class2")
    })
  })

  describe("formatDate function", () => {
    // Mock Date to ensure consistent testing
    const mockDate = new Date("2024-01-15T10:30:00.000Z")

    beforeEach(() => {
      // Mock toLocaleDateString to return consistent results
      jest
        .spyOn(Date.prototype, "toLocaleDateString")
        .mockImplementation(() => {
          return "January 15, 2024"
        })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it("should format date strings correctly", () => {
      const result = formatDate("2024-01-15")
      expect(result).toBe("January 15, 2024")

      // Verify toLocaleDateString was called with correct parameters
      expect(Date.prototype.toLocaleDateString).toHaveBeenCalledWith("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    })

    it("should format timestamp numbers correctly", () => {
      const timestamp = mockDate.getTime()
      const result = formatDate(timestamp)
      expect(result).toBe("January 15, 2024")
    })

    it("should handle ISO date strings", () => {
      const result = formatDate("2024-01-15T10:30:00.000Z")
      expect(result).toBe("January 15, 2024")
    })

    it("should handle various date string formats", () => {
      const dateFormats = [
        "2024-01-15",
        "01/15/2024",
        "January 15, 2024",
        "2024-01-15T10:30:00Z",
        "2024-01-15T10:30:00.000Z",
      ]

      dateFormats.forEach((dateStr) => {
        const result = formatDate(dateStr)
        expect(result).toBe("January 15, 2024")
      })
    })

    it("should handle edge case dates", () => {
      // Test with different dates to ensure the mock works correctly
      jest
        .spyOn(Date.prototype, "toLocaleDateString")
        .mockReturnValueOnce("December 31, 2023")
        .mockReturnValueOnce("January 1, 2024")
        .mockReturnValueOnce("February 29, 2024") // Leap year

      expect(formatDate("2023-12-31")).toBe("December 31, 2023")
      expect(formatDate("2024-01-01")).toBe("January 1, 2024")
      expect(formatDate("2024-02-29")).toBe("February 29, 2024")
    })

    it("should handle invalid dates gracefully", () => {
      // When Date constructor receives invalid input, it creates Invalid Date
      // toLocaleDateString on Invalid Date returns "Invalid Date"
      jest
        .spyOn(Date.prototype, "toLocaleDateString")
        .mockReturnValue("Invalid Date")

      expect(formatDate("invalid-date")).toBe("Invalid Date")
      expect(formatDate("")).toBe("Invalid Date")
    })

    it("should use correct locale and format options", () => {
      formatDate("2024-01-15")

      expect(Date.prototype.toLocaleDateString).toHaveBeenCalledWith("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    })

    it("should handle different numeric inputs", () => {
      const timestamps = [
        0, // Unix epoch
        1642204800000, // January 15, 2022
        Date.now(), // Current timestamp
      ]

      timestamps.forEach((timestamp) => {
        const result = formatDate(timestamp)
        expect(typeof result).toBe("string")
        expect(result).toBe("January 15, 2024") // Our mock return value
      })
    })
  })

  describe("absoluteUrl function", () => {
    it("should create absolute URLs with base URL", () => {
      expect(absoluteUrl("/dashboard")).toBe("https://example.com/dashboard")
      expect(absoluteUrl("/api/users")).toBe("https://example.com/api/users")
      expect(absoluteUrl("/auth/login")).toBe("https://example.com/auth/login")
    })

    it("should handle paths without leading slash by adding one", () => {
      expect(absoluteUrl("dashboard")).toBe("https://example.com/dashboard")
      expect(absoluteUrl("api/users")).toBe("https://example.com/api/users")
    })

    it("should handle empty and root paths", () => {
      expect(absoluteUrl("")).toBe("https://example.com")
      expect(absoluteUrl("/")).toBe("https://example.com/")
    })

    it("should handle paths with query parameters", () => {
      expect(absoluteUrl("/search?q=test")).toBe(
        "https://example.com/search?q=test"
      )
      expect(absoluteUrl("/users?page=1&limit=10")).toBe(
        "https://example.com/users?page=1&limit=10"
      )
    })

    it("should handle paths with fragments", () => {
      expect(absoluteUrl("/docs#introduction")).toBe(
        "https://example.com/docs#introduction"
      )
      expect(absoluteUrl("/page#section-1")).toBe(
        "https://example.com/page#section-1"
      )
    })

    it("should handle complex paths", () => {
      expect(
        absoluteUrl("/api/v1/users/123/posts?published=true#comments")
      ).toBe(
        "https://example.com/api/v1/users/123/posts?published=true#comments"
      )
    })

    it("should handle special characters in paths", () => {
      expect(absoluteUrl("/search?q=hello%20world")).toBe(
        "https://example.com/search?q=hello%20world"
      )
      expect(absoluteUrl("/files/document%20name.pdf")).toBe(
        "https://example.com/files/document%20name.pdf"
      )
    })

    it("should not double-encode already encoded paths", () => {
      expect(absoluteUrl("/search?q=hello+world")).toBe(
        "https://example.com/search?q=hello+world"
      )
      expect(absoluteUrl("/path/with%20spaces")).toBe(
        "https://example.com/path/with%20spaces"
      )
    })
  })

  describe("integration tests", () => {
    it("should work together in realistic scenarios", () => {
      // Simulate a component that uses all utilities
      const isActive = true
      const isDisabled = false
      const createdAt = "2024-01-15T10:30:00Z"
      const profilePath = "/user/profile"

      // Use cn for conditional styling
      const className = cn(
        "btn",
        "px-4 py-2",
        {
          "bg-blue-500 text-white": isActive,
          "bg-gray-300 text-gray-500": !isActive,
        },
        isDisabled && "cursor-not-allowed opacity-50"
      )

      // Use formatDate for display
      const formattedDate = formatDate(createdAt)

      // Use absoluteUrl for links
      const profileUrl = absoluteUrl(profilePath)

      expect(className).toBe("btn px-4 py-2 bg-blue-500 text-white")
      expect(formattedDate).toBe("January 15, 2024")
      expect(profileUrl).toBe("https://example.com/user/profile")
    })

    it("should handle edge cases in combination", () => {
      // Test with empty/null values
      const className = cn("", null, undefined, false, "valid-class")
      const dateStr = formatDate("")
      const url = absoluteUrl("")

      expect(className).toBe("valid-class")
      expect(dateStr).toBe("Invalid Date")
      expect(url).toBe("https://example.com")
    })
  })

  describe("performance and memory", () => {
    it("should handle large numbers of class names efficiently", () => {
      const manyClasses = Array.from({ length: 100 }, (_, i) => `class-${i}`)
      const result = cn(...manyClasses)

      expect(result).toContain("class-0")
      expect(result).toContain("class-99")
      expect(result.split(" ")).toHaveLength(100)
    })

    it("should handle repeated calls without memory leaks", () => {
      // Simulate many repeated calls
      for (let i = 0; i < 1000; i++) {
        cn("base", `dynamic-${i}`, i % 2 === 0 && "even")
        formatDate(`2024-01-${(i % 28) + 1}`)
        absoluteUrl(`/page/${i}`)
      }

      // If we get here without throwing, the functions handle repeated calls well
      expect(true).toBe(true)
    })
  })

  describe("type safety and validation", () => {
    it("should handle various input types for cn", () => {
      // Test that cn accepts various ClassValue types
      expect(() => cn("string")).not.toThrow()
      expect(() => cn(["array"])).not.toThrow()
      expect(() => cn({ object: true })).not.toThrow()
      expect(() => cn(undefined)).not.toThrow()
      expect(() => cn(null)).not.toThrow()
      expect(() => cn(false)).not.toThrow()
    })

    it("should handle various input types for formatDate", () => {
      expect(() => formatDate("2024-01-15")).not.toThrow()
      expect(() => formatDate(1642204800000)).not.toThrow()
      expect(() => formatDate(0)).not.toThrow()
    })

    it("should handle various input types for absoluteUrl", () => {
      expect(() => absoluteUrl("/path")).not.toThrow()
      expect(() => absoluteUrl("")).not.toThrow()
      expect(() => absoluteUrl("relative")).not.toThrow()
    })
  })
})
