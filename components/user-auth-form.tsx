"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import type { FieldErrors } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userLoginSchema, userRegisterSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  mode?: "login" | "register"
}

type LoginFormData = z.infer<typeof userLoginSchema>
type RegisterFormData = z.infer<typeof userRegisterSchema>

export function UserAuthForm({
  className,
  mode = "login",
  ...props
}: UserAuthFormProps) {
  const isRegisterMode = mode === "register"
  const schema = isRegisterMode ? userRegisterSchema : userLoginSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(schema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: LoginFormData | RegisterFormData) {
    setIsLoading(true)

    try {
      if (isRegisterMode) {
        // Handle registration
        const registerData = data as RegisterFormData
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
            confirmPassword: registerData.confirmPassword,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Registration failed")
        }

        // Automatically sign in the user after successful registration
        const signInResult = await signIn("credentials", {
          email: registerData.email.toLowerCase(),
          password: registerData.password,
          redirect: true,
          callbackUrl: searchParams?.get("from") || "/dashboard",
        })

        if (signInResult?.error) {
          // If auto-login fails, show success message and let user manually login
          toast({
            title: "Account created",
            description: "You can now sign in with your email and password.",
          })
        }
      } else {
        // Handle login
        const loginData = data as LoginFormData
        const signInResult = await signIn("credentials", {
          email: loginData.email.toLowerCase(),
          password: loginData.password,
          redirect: true,
          callbackUrl: searchParams?.get("from") || "/dashboard",
        })

        if (signInResult?.error) {
          throw new Error("Invalid email or password")
        }
      }
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {isRegisterMode && (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Full name"
                type="text"
                autoComplete="name"
                disabled={isLoading || isGitHubLoading}
                {...register("name")}
              />
              {isRegisterMode &&
                (errors as FieldErrors<RegisterFormData>)?.name && (
                  <p className="px-1 text-xs text-red-600">
                    {
                      (errors as FieldErrors<RegisterFormData>).name
                        ?.message as string
                    }
                  </p>
                )}
            </div>
          )}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete={
                isRegisterMode ? "new-password" : "current-password"
              }
              disabled={isLoading || isGitHubLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
            {isRegisterMode && (
              <div className="px-1 text-xs text-muted-foreground">
                <p>Password must be at least 12 characters with:</p>
                <ul className="ml-2 list-inside list-disc">
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                  <li>No common words or patterns</li>
                </ul>
              </div>
            )}
          </div>
          {isRegisterMode && (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                placeholder="Confirm password"
                type="password"
                autoComplete="new-password"
                disabled={isLoading || isGitHubLoading}
                {...register("confirmPassword")}
              />
              {isRegisterMode &&
                (errors as FieldErrors<RegisterFormData>)?.confirmPassword && (
                  <p className="px-1 text-xs text-red-600">
                    {
                      (errors as FieldErrors<RegisterFormData>).confirmPassword
                        ?.message as string
                    }
                  </p>
                )}
            </div>
          )}
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {isRegisterMode ? "Create Account" : "Sign In"}
          </button>
        </div>
      </form>
      <div className="relative hidden">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }), "hidden")}
        onClick={() => {
          setIsGitHubLoading(true)
          signIn("github")
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 size-4" />
        )}{" "}
        Github
      </button>
    </div>
  )
}
