import React from "react"
import { expectComponentSnapshot } from "../helpers/snapshot-helpers"
import { CardSkeleton } from "@/components/card-skeleton"

describe("CardSkeleton Snapshots", () => {
  it("matches snapshot", () => {
    expectComponentSnapshot(<CardSkeleton />)
  })
})
