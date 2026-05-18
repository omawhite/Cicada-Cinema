import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { MovieCard } from "../MovieCard"

const meta = {
  title: "Components/MovieCard",
  component: MovieCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Movie Title",
    price: "$12.00",
    posterSrc: "https://placehold.co/239x313",
    ctaLabel: "Book Tickets",
  },
} satisfies Meta<typeof MovieCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMovieTimes: Story = {
  args: {
    movieTimes: ["6:00 PM", "8:30 PM", "11:00 PM"],
  },
  render: (args) => {
    const [selectedTime, setSelectedTime] = useState<string | undefined>()
    return (
      <MovieCard
        {...args}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
      />
    )
  },
}

export const LongTitle: Story = {
  args: {
    title: "A Very Long Movie Title That Wraps",
    price: "$15.00",
    movieTimes: ["7:00 PM"],
  },
}
