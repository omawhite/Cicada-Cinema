import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScreeningsArchiveTable } from "../ScreeningsArchiveTable";
import type { ArchivedScreening } from "@/lib/archived-screenings";

const mockScreenings: ArchivedScreening[] = [
  {
    film: "La Jetée",
    date: "2024-11-12",
    location: "Main Hall",
    series: "French New Wave",
    year: "1962",
    partners: "Alliance Française",
  },
  {
    film: "Stalker",
    date: "2024-10-05",
    location: "Annex",
    series: "Soviet Cinema",
    year: "1979",
    partners: "",
  },
  {
    film: "Sans Soleil",
    date: "2024-08-20",
    location: "Main Hall",
    series: "Essay Films",
    year: "1983",
    partners: "Film Forum",
  },
  {
    film: "Jeanne Dielman",
    date: "2024-06-14",
    location: "Main Hall",
    series: "",
    year: "1975",
    partners: "Criterion Collection, Film at Lincoln Center",
  },
  {
    film: "In the Mood for Love",
    date: "2024-04-03",
    location: "Garden Room",
    series: "Wong Kar-wai Retrospective",
    year: "2000",
    partners: "Hong Kong Film Archive",
  },
];

const meta = {
  title: "Components/ScreeningsArchiveTable",
  component: ScreeningsArchiveTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays past screenings for the archive page. Supports sorting by date, film, series, and year, and filtering by series or year.",
      },
    },
  },
  argTypes: {
    screenings: { control: false },
  },
} satisfies Meta<typeof ScreeningsArchiveTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    screenings: mockScreenings,
  },
};

export const Empty: Story = {
  args: {
    screenings: [],
  },
};

export const SingleEntry: Story = {
  args: {
    screenings: [mockScreenings[0]],
  },
};