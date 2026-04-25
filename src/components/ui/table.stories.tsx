import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRows = [
  { name: "Alice", role: "Engineer", department: "Platform", status: "Active" },
  { name: "Bob", role: "Designer", department: "Product", status: "Active" },
  { name: "Carol", role: "Manager", department: "Engineering", status: "On leave" },
  { name: "David", role: "Analyst", department: "Data", status: "Active" },
  { name: "Eve", role: "Engineer", department: "Security", status: "Inactive" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleRows.map((row) => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table")).toBeVisible();
    await expect(canvas.getAllByRole("row")).toHaveLength(sampleRows.length + 1);
  },
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of team members and their roles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleRows.map((row) => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>{row.department}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleRows.map((row) => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>{sampleRows.length} members total</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const SingleRow: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{sampleRows[0].name}</TableCell>
          <TableCell>{sampleRows[0].role}</TableCell>
          <TableCell>{sampleRows[0].department}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="text-center text-muted-foreground">
            No data.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("No data.")).toBeVisible();
  },
};
