import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Sale {
  id: string;
  saleNumber: string;
  total: number;
  posFee: number;
  status: string;
  createdAt: Date;
  store: {
    name: string;
  };
  employee: {
    name: string;
  };
}

interface RecentSalesTableProps {
  sales: Sale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sale #</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>POS Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No sales yet
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.saleNumber}</TableCell>
                <TableCell>{sale.store.name}</TableCell>
                <TableCell>{sale.employee.name}</TableCell>
                <TableCell>${sale.total.toFixed(2)}</TableCell>
                <TableCell className="text-primary font-medium">
                  ${sale.posFee.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      sale.status === "COMPLETED"
                        ? "default"
                        : sale.status === "RETURNED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(sale.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
