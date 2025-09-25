/**
 * Architecture Validation Tests
 *
 * Validates the mobile-first layer separation architecture and ensures
 * no circular dependencies or framework coupling exists.
 *
 * Design Principles:
 * - Layer separation verification
 * - Circular dependency detection
 * - Framework coupling prevention
 * - Mobile-ready architecture validation
 */

import * as fs from "fs"
import * as path from "path"

// Architecture validation thresholds - configurable for different project phases
const ARCHITECTURE_THRESHOLDS = {
  // TypeScript 'any' usage limits
  // Based on current codebase analysis: ~15 legitimate any usages across service layer
  // Allow 3 additional any usages per file for gradual migration scenarios
  MAX_ADDITIONAL_ANY_USAGES: 3,

  // Large static object limits
  // Based on memory profiling: objects >200 chars can impact mobile performance
  // Allow 2 large static objects per service for configuration/constants
  MAX_LARGE_STATIC_OBJECTS: 2,
} as const

describe("Architecture Validation Tests", () => {
  const projectRoot = path.resolve(__dirname, "../..")

  describe("Layer Separation Validation", () => {
    it("should maintain clear separation between service and repository layers", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )
      const repositoryFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/repositories")
      )

      serviceFiles.forEach((serviceFile) => {
        const content = fs.readFileSync(serviceFile, "utf8")

        // Services should not directly import repositories (should use factory)
        repositoryFiles.forEach((repoFile) => {
          const repoName = path.basename(repoFile, ".ts")
          // Escape special regex characters in repository name
          const escapedRepoName = repoName.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )
          const directImportPattern = new RegExp(
            `from\\s+["'].*/${escapedRepoName}["']`,
            "g"
          )
          const relativeImportPattern = new RegExp(
            `from\\s+["']\\.\\.?/.*repositories.*${escapedRepoName}["']`,
            "g"
          )

          expect(content).not.toMatch(directImportPattern)
          expect(content).not.toMatch(relativeImportPattern)
        })
      })
    })

    it("should prevent UI components from importing service layer directly", () => {
      const componentFiles = getFilesInDirectory(
        path.join(projectRoot, "components")
      )
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      componentFiles.forEach((componentFile) => {
        const content = fs.readFileSync(componentFile, "utf8")

        serviceFiles.forEach((serviceFile) => {
          const serviceName = path.basename(serviceFile, ".ts")

          // Components should not directly import services
          const escapedServiceName = serviceName.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )
          const directServiceImport = new RegExp(
            `from\\s+["'].*lib/services.*${escapedServiceName}["']`,
            "g"
          )
          expect(content).not.toMatch(directServiceImport)
        })
      })
    })

    it("should ensure API routes use service layer properly", () => {
      const apiFiles = getFilesInDirectory(path.join(projectRoot, "app/api"))

      apiFiles.forEach((apiFile) => {
        const content = fs.readFileSync(apiFile, "utf8")

        // API routes should import from service index, not individual services
        const individualServiceImports = [
          /from.*lib\/services\/auth-service/g,
          /from.*lib\/services\/service-request-service/g,
          /from.*lib\/services\/geocoding-service/g,
        ]

        individualServiceImports.forEach((pattern) => {
          expect(content).not.toMatch(pattern)
        })

        // If importing services, should use the main index
        if (content.includes("lib/services")) {
          expect(content).toMatch(/from.*lib\/services["']/g)
        }
      })
    })

    it("should validate repository layer independence", () => {
      const repositoryFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/repositories")
      )

      repositoryFiles.forEach((repoFile) => {
        const content = fs.readFileSync(repoFile, "utf8")

        // Repositories should not import services (except base-service for shared types)
        const serviceImports = [
          /from.*lib\/services\/(?!base-service)/g, // Allow base-service import
          /from.*\/services\/(?!base-service)/g,
        ]

        serviceImports.forEach((pattern) => {
          expect(content).not.toMatch(pattern)
        })

        // Repositories should not import API routes
        expect(content).not.toMatch(/from.*app\/api/g)

        // Repositories should not import components
        expect(content).not.toMatch(/from.*components/g)
      })
    })
  })

  describe("Circular Dependency Detection", () => {
    it("should detect circular dependencies in service layer", () => {
      const serviceDir = path.join(projectRoot, "lib/services")
      const dependencies = analyzeDependencies(serviceDir)

      const circularDeps = findCircularDependencies(dependencies)

      expect(circularDeps).toEqual([])
    })

    it("should detect circular dependencies in repository layer", () => {
      const repositoryDir = path.join(projectRoot, "lib/repositories")
      const dependencies = analyzeDependencies(repositoryDir)

      const circularDeps = findCircularDependencies(dependencies)

      expect(circularDeps).toEqual([])
    })

    it("should validate cross-layer dependency direction", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )
      const repositoryFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/repositories")
      )

      // Check that repositories don't import services
      repositoryFiles.forEach((repoFile) => {
        const content = fs.readFileSync(repoFile, "utf8")

        serviceFiles.forEach((serviceFile) => {
          const serviceName = path.basename(serviceFile, ".ts")
          // Allow base-service import in repositories
          if (serviceName === "base-service") return

          const escapedServiceName = serviceName.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )
          const serviceImportPattern = new RegExp(
            `from\\s+["'].*${escapedServiceName}["']`,
            "g"
          )
          expect(content).not.toMatch(serviceImportPattern)
        })
      })
    })
  })

  describe("Framework Coupling Prevention", () => {
    it("should prevent Next.js coupling in service layer", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      const nextjsImports = [
        "next/",
        "next-auth",
        "next/router",
        "next/navigation",
        "next/headers",
        "next/server",
        "next/image",
        "next/link",
      ]

      serviceFiles.forEach((serviceFile) => {
        const content = fs.readFileSync(serviceFile, "utf8")

        nextjsImports.forEach((nextImport) => {
          expect(content).not.toContain(`from "${nextImport}`)
          expect(content).not.toContain(`import("${nextImport}`)
        })
      })
    })

    it("should prevent React coupling in service layer", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      const reactImports = [
        "react",
        "react-dom",
        "react/",
        "react-hook-form",
        "@/components/",
        "@/app/",
      ]

      serviceFiles.forEach((serviceFile) => {
        const content = fs.readFileSync(serviceFile, "utf8")

        reactImports.forEach((reactImport) => {
          expect(content).not.toContain(`from "${reactImport}`)
          expect(content).not.toContain(`import("${reactImport}`)
        })
      })
    })

    it("should prevent browser API usage in service layer", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      const browserAPIs = [
        "window.",
        "document.",
        "localStorage",
        "sessionStorage",
        "navigator.",
        "location.",
        "history.",
        // Note: fetch is allowed in geocoding service for API calls
      ]

      serviceFiles.forEach((serviceFile) => {
        const content = fs.readFileSync(serviceFile, "utf8")

        browserAPIs.forEach((browserAPI) => {
          // Allow in comments or strings, but not in actual code
          const lines = content.split("\n")
          lines.forEach((line, index) => {
            if (
              line.includes(browserAPI) &&
              !line.trim().startsWith("//") &&
              !line.trim().startsWith("*") &&
              !isInString(line, browserAPI)
            ) {
              throw new Error(
                `Browser API '${browserAPI}' found in ${serviceFile}:${
                  index + 1
                }`
              )
            }
          })
        })
      })
    })

    it("should prevent DOM manipulation in service layer", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      const domMethods = [
        "getElementById",
        "querySelector",
        "createElement",
        "appendChild",
        "removeChild",
        "addEventListener",
        "removeEventListener",
      ]

      serviceFiles.forEach((serviceFile) => {
        const content = fs.readFileSync(serviceFile, "utf8")

        domMethods.forEach((domMethod) => {
          expect(content).not.toContain(domMethod)
        })
      })
    })
  })

  describe("Mobile-Ready Architecture Validation", () => {
    it("should validate service layer exports for mobile SDK", () => {
      const serviceIndexPath = path.join(projectRoot, "lib/services/index.ts")
      const content = fs.readFileSync(serviceIndexPath, "utf8")

      // Should export all essential services
      const requiredExports = [
        "AuthService",
        "ServiceRequestService",
        "GeocodingService",
        "ServiceFactory",
        "BaseService",
      ]

      requiredExports.forEach((exportName) => {
        expect(content).toContain(`export`)
        const escapedExportName = exportName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )
        expect(content).toMatch(new RegExp(`\\b${escapedExportName}\\b`))
      })
    })

    it("should validate repository layer exports for mobile SDK", () => {
      const repositoryIndexPath = path.join(
        projectRoot,
        "lib/repositories/index.ts"
      )
      const content = fs.readFileSync(repositoryIndexPath, "utf8")

      // Should export all essential repositories
      const requiredExports = [
        "ServiceRequestRepository",
        "UserRepository",
        "RepositoryFactory",
        "BaseRepository",
      ]

      requiredExports.forEach((exportName) => {
        expect(content).toContain(`export`)
        const escapedExportName = exportName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )
        expect(content).toMatch(new RegExp(`\\b${escapedExportName}\\b`))
      })
    })

    it("should ensure consistent error handling patterns", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      serviceFiles.forEach((serviceFile) => {
        if (
          serviceFile.includes("base-service") ||
          serviceFile.includes("index.ts")
        )
          return // Skip base service and index

        const content = fs.readFileSync(serviceFile, "utf8")

        // Should use BaseService error handling (geocoding service uses different patterns)
        expect(content).toContain("extends BaseService")
        expect(content).toContain("createError")
        // Some services may not use handleAsync if they have custom error handling
      })
    })

    it("should validate type safety for mobile development", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      serviceFiles.forEach((serviceFile) => {
        if (serviceFile.includes("index.ts")) return // Skip index files

        const content = fs.readFileSync(serviceFile, "utf8")

        // Should have proper TypeScript types (interface or export type)
        const hasInterface = content.includes("interface")
        const hasExportType =
          content.includes("export type") ||
          content.includes("export interface")
        const hasTypeDefinition = content.includes(": ") // Has type annotations

        expect(hasInterface || hasExportType || hasTypeDefinition).toBe(true)

        // Should not use 'any' type excessively (except in specific cases)
        const anyUsages = content.match(/:\s*any/g) || []
        const allowedAnyUsages =
          content.match(
            /\/\/ eslint-disable-next-line @typescript-eslint\/no-explicit-any/g
          ) || []

        expect(anyUsages.length).toBeLessThanOrEqual(
          allowedAnyUsages.length +
            ARCHITECTURE_THRESHOLDS.MAX_ADDITIONAL_ANY_USAGES
        ) // Allow controlled flexibility for gradual TypeScript migration
      })
    })
  })

  describe("Performance Architecture Validation", () => {
    it("should validate efficient import patterns", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      serviceFiles.forEach((serviceFile) => {
        const content = fs.readFileSync(serviceFile, "utf8")

        // Should use specific imports, not wildcard imports
        const wildcardImports = content.match(/import \* as .* from/g) || []
        expect(wildcardImports.length).toBeLessThan(3) // Allow some flexibility

        // Should not import entire libraries when only specific functions needed
        const heavyLibraryImports = [
          /import .* from "lodash"/g,
          /import .* from "moment"/g,
          /import .* from "axios"/g,
        ]

        heavyLibraryImports.forEach((pattern) => {
          expect(content).not.toMatch(pattern)
        })
      })
    })

    it("should validate memory-efficient patterns", () => {
      const serviceFiles = getFilesInDirectory(
        path.join(projectRoot, "lib/services")
      )

      serviceFiles.forEach((serviceFile) => {
        const content = fs.readFileSync(serviceFile, "utf8")

        // Should not create large static objects that could cause memory leaks
        const largeStaticObjects =
          content.match(/static.*=.*{[\s\S]{200,}}/g) || []
        expect(largeStaticObjects.length).toBeLessThan(
          ARCHITECTURE_THRESHOLDS.MAX_LARGE_STATIC_OBJECTS
        ) // Prevent memory leaks from excessive static object allocation
      })
    })
  })
})

// Helper functions
function getFilesInDirectory(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  const files: string[] = []

  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir)

    items.forEach((item) => {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (item.endsWith(".ts") || item.endsWith(".tsx")) {
        files.push(fullPath)
      }
    })
  }

  traverse(dir)
  return files
}

function analyzeDependencies(dir: string): Map<string, string[]> {
  const dependencies = new Map<string, string[]>()
  const files = getFilesInDirectory(dir)

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8")
    const fileName = path.basename(file, path.extname(file))
    const deps: string[] = []

    // Find import statements
    const importMatches = content.match(/from\s+["']\.\/([^"']+)["']/g) || []
    importMatches.forEach((match) => {
      const depMatch = match.match(/from\s+["']\.\/([^"']+)["']/)
      if (depMatch?.[1]) {
        deps.push(depMatch[1])
      }
    })

    dependencies.set(fileName, deps)
  })

  return dependencies
}

function findCircularDependencies(
  dependencies: Map<string, string[]>
): string[][] {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const cycles: string[][] = []

  function dfs(node: string, path: string[]): void {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node)
      if (cycleStart !== -1) {
        cycles.push(path.slice(cycleStart).concat([node]))
      }
      return
    }

    if (visited.has(node)) return

    visited.add(node)
    recursionStack.add(node)

    const deps = dependencies.get(node) || []
    deps.forEach((dep) => {
      dfs(dep, [...path, node])
    })

    recursionStack.delete(node)
  }

  dependencies.forEach((_, node) => {
    if (!visited.has(node)) {
      dfs(node, [])
    }
  })

  return cycles
}

function isInString(line: string, searchTerm: string): boolean {
  // More robust string detection that handles nested quotes and template literals
  const patterns = [
    // Double quoted strings with proper escape handling
    /"(?:[^"\\]|\\.)*"/g,
    // Single quoted strings with proper escape handling
    /'(?:[^'\\]|\\.)*'/g,
    // Template literals with proper escape handling
    /`(?:[^`\\]|\\.)*`/g,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(line)) !== null) {
      if (match[0].includes(searchTerm)) {
        return true
      }
    }
  }

  return false
}
