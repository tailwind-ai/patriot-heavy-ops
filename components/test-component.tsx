import React from "react"

const TestComponent = () => {
  const message = "properly formatted"
  const formatted = { spacing: "good", quotes: "consistent" }

  return (
    <div>
      {message} - {formatted.spacing}
    </div>
  )
}

export default TestComponent
