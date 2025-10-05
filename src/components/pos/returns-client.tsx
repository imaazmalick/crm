"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReturnDialog } from "@/components/pos/return-dialog";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Search, Filter, X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReturnsClientProps {
  sales: any[];
  returns: any[];
}

export function ReturnsClient({ sales, returns }: ReturnsClientProps) {
  const [salesSearch, setSalesSearch] = useState("");
  const [returnsSearch, setReturnsSearch] = useState("");
  const [salesSort, setSalesSort] = useState("newest");
  const [returnsSort, setReturnsSort] = useState("newest");
  const [salesDateFilter, setSalesDateFilter] = useState("all");
  const [returnsDateFilter, setReturnsDateFilter] = useState("all");

  // Filter and sort sales
  const filteredSales = useMemo(() => {
    let filtered = [...sales];

    // Search filter
    if (salesSearch) {
      filtered = filtered.filter((sale) => {
        const searchLower = salesSearch.toLowerCase();
        return (
          sale.id.toLowerCase().includes(searchLower) ||
          sale.employee.name.toLowerCase().includes(searchLower) ||
          sale.items.some((item: any) =>
            item.product.name.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    // Date filter
    const now = Date.now();
    if (salesDateFilter === "today") {
      filtered = filtered.filter(
        (sale) =>
          new Date(sale.createdAt).toDateString() === new Date().toDateString()
      );
    } else if (salesDateFilter === "week") {
      filtered = filtered.filter(
        (sale) =>
          new Date(sale.createdAt).getTime() > now - 7 * 24 * 60 * 60 * 1000
      );
    } else if (salesDateFilter === "month") {
      filtered = filtered.filter(
        (sale) =>
          new Date(sale.createdAt).getTime() > now - 30 * 24 * 60 * 60 * 1000
      );
    }

    // Sort
    if (salesSort === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (salesSort === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (salesSort === "highest") {
      filtered.sort((a, b) => b.total - a.total);
    } else if (salesSort === "lowest") {
      filtered.sort((a, b) => a.total - b.total);
    }

    return filtered;
  }, [sales, salesSearch, salesSort, salesDateFilter]);

  // Filter and sort returns
  const filteredReturns = useMemo(() => {
    let filtered = [...returns];

    // Search filter
    if (returnsSearch) {
      filtered = filtered.filter((returnItem) => {
        const searchLower = returnsSearch.toLowerCase();
        return (
          returnItem.id.toLowerCase().includes(searchLower) ||
          returnItem.saleId.toLowerCase().includes(searchLower) ||
          returnItem.reason.toLowerCase().includes(searchLower) ||
          returnItem.processedBy.name.toLowerCase().includes(searchLower)
        );
      });
    }

    // Date filter
    const now = Date.now();
    if (returnsDateFilter === "today") {
      filtered = filtered.filter(
        (returnItem) =>
          new Date(returnItem.createdAt).toDateString() ===
          new Date().toDateString()
      );
    } else if (returnsDateFilter === "week") {
      filtered = filtered.filter(
        (returnItem) =>
          new Date(returnItem.createdAt).getTime() >
          now - 7 * 24 * 60 * 60 * 1000
      );
    } else if (returnsDateFilter === "month") {
      filtered = filtered.filter(
        (returnItem) =>
          new Date(returnItem.createdAt).getTime() >
          now - 30 * 24 * 60 * 60 * 1000
      );
    }

    // Sort
    if (returnsSort === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (returnsSort === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (returnsSort === "highest") {
      filtered.sort((a, b) => b.refundAmount - a.refundAmount);
    } else if (returnsSort === "lowest") {
      filtered.sort((a, b) => a.refundAmount - b.refundAmount);
    }

    return filtered;
  }, [returns, returnsSearch, returnsSort, returnsDateFilter]);

  const clearSalesFilters = () => {
    setSalesSearch("");
    setSalesSort("newest");
    setSalesDateFilter("all");
  };

  const clearReturnsFilters = () => {
    setReturnsSearch("");
    setReturnsSort("newest");
    setReturnsDateFilter("all");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Recent Sales for Returns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Sales</h2>
          <Badge variant="secondary">{filteredSales.length} sales</Badge>
        </div>

        {/* Sales Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by sale ID, product, or employee..."
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                value={salesDateFilter}
                onValueChange={setSalesDateFilter}
              >
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={salesSort} onValueChange={setSalesSort}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(salesSearch ||
              salesDateFilter !== "all" ||
              salesSort !== "newest") && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSalesFilters}
                className="w-full bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Sales List */}
        {filteredSales.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                {salesSearch
                  ? "No sales found matching your search"
                  : "No recent sales"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSales.map((sale) => (
            <Card key={sale.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Sale #{sale.id.slice(-8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(sale.createdAt), "PP")} •{" "}
                      {sale.employee.name}
                    </p>
                  </div>
                  <ReturnDialog sale={sale} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {sale.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-1 flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(sale.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Return History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Return History</h2>
          <Badge variant="secondary">{filteredReturns.length} returns</Badge>
        </div>

        {/* Returns Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by return ID, sale ID, or reason..."
                value={returnsSearch}
                onChange={(e) => setReturnsSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                value={returnsDateFilter}
                onValueChange={setReturnsDateFilter}
              >
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={returnsSort} onValueChange={setReturnsSort}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Refund</SelectItem>
                  <SelectItem value="lowest">Lowest Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(returnsSearch ||
              returnsDateFilter !== "all" ||
              returnsSort !== "newest") && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearReturnsFilters}
                className="w-full bg-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Returns List */}
        {filteredReturns.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                {returnsSearch
                  ? "No returns found matching your search"
                  : "No returns yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReturns.map((returnItem) => (
            <Card key={returnItem.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Return #{returnItem.id.slice(-8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(returnItem.createdAt), "PP")} •{" "}
                    </p>
                  </div>
                  <Badge variant="destructive">Returned</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">
                      Original Sale:
                    </span>{" "}
                    #{returnItem.saleId.slice(-8)}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Reason:</span>{" "}
                    {returnItem.reason}
                  </p>
                  <div className="border-t pt-2">
                    <p className="font-medium">
                      Refund Amount: {formatCurrency(returnItem.refundAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
