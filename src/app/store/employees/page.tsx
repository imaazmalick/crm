import { getEmployees } from "@/actions/employees";
import { EmployeesTable } from "@/components/store/employees-table";
import { EmployeeFormDialog } from "@/components/store/employee-form-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EmployeesPage() {
  const result = await getEmployees();

  if ("error" in result) {
    return <div>Error loading employees</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your store staff</p>
        </div>
        <EmployeeFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>View and manage employee accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesTable employees={result.employees} />
        </CardContent>
      </Card>
    </div>
  );
}
