import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Role } from "@/generated/prisma/enums";
import { UserTableRow } from "@/types/user";
import { RoleSelect } from "./RoleSelect";
import { DeleteUserButton } from "./DeleteUserButton";

export const getColumns = (
  onRoleChange?: (userId: string, newRole: Role) => Promise<void>,
  onDeleteUser?: (userId: string) => Promise<void>
): ColumnDef<UserTableRow>[] => [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
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
    enableGlobalFilter: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <RoleSelect user={row.original} onRoleChange={onRoleChange} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DeleteUserButton user={row.original} onDeleteUser={onDeleteUser} />
      );
    },
  },
];
