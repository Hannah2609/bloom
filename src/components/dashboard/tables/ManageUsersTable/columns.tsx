import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Role } from "@/types/user";
import { UserTableRow } from "@/types/user";
import { RoleSelect } from "./RoleSelect";
import { DeleteUserButton } from "./DeleteUserButton";

export const getColumns = (
  onRoleChange?: (userId: string, newRole: Role) => Promise<void>,
  onDeleteUser?: (userId: string) => Promise<void>
): ColumnDef<UserTableRow>[] => [
  {
    accessorKey: "email",
    size: 250,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-primary! dark:hover:text-background font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  // Hidden columns for searching
  {
    accessorKey: "firstName",
    header: "First Name",
    enableHiding: true,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    enableHiding: true,
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "name",
    size: 200,
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-primary! dark:hover:text-background font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          {user.firstName} {user.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    size: 150,
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="hover:bg-primary! dark:hover:text-background font-bold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <RoleSelect user={row.original} onRoleChange={onRoleChange} />
        </div>
      );
    },
  },
  {
    id: "actions",
    size: 100,
    header: () => {
      return <span className="text-base font-bold">Actions</span>;
    },
    cell: ({ row }) => {
      return (
        <DeleteUserButton user={row.original} onDeleteUser={onDeleteUser} />
      );
    },
  },
];
