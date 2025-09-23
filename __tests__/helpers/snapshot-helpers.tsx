import React, { ReactElement } from "react"
import { render } from "@testing-library/react"

export const renderForSnapshot = (ui: ReactElement) => {
  const { container } = render(ui)
  return container.firstChild
}

export const expectComponentSnapshot = (component: ReactElement, name?: string) => {
  const rendered = renderForSnapshot(component)
  if (name) {
    expect(rendered).toMatchSnapshot(name)
  } else {
    expect(rendered).toMatchSnapshot()
  }
}

export const snapshotStates = {
  loading: { isLoading: true },
  error: { error: "Test error message" },
  empty: { data: [] },
  populated: { data: ["item1", "item2"] },
}


