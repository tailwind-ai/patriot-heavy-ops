import React from "react"
import { expectComponentSnapshot } from "../helpers/snapshot-helpers"
import { UserAuthForm } from "@/components/user-auth-form"

describe("UserAuthForm Snapshots", () => {
  it("matches snapshot in login mode", () => {
    expectComponentSnapshot(<UserAuthForm mode="login" />)
  })

  it("matches snapshot in register mode", () => {
    expectComponentSnapshot(<UserAuthForm mode="register" />)
  })
})


