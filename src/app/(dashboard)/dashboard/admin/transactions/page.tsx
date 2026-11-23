"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAdminTransactions } from "@/lib/api/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaymentRecord } from "@/types";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminTransactions()
      .then((res) => setTransactions(res.transactions || []))
      .catch((err: unknown) =>
        toast.error(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Stripe Transactions</h1>
          <p className="text-sm text-muted-foreground">
            All Pro Tutor & Pro Student subscription payments synced from Stripe.
          </p>
        </div>
        <Badge variant="success" className="px-4 py-1.5 text-sm">
          Total Revenue: ${totalRevenue.toLocaleString()} USD
        </Badge>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No Stripe payments recorded yet.
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell>
                    <p className="font-bold">{tx.userName}</p>
                    <p className="text-xs text-muted-foreground">{tx.userEmail}</p>
                  </TableCell>
                  <TableCell className="capitalize">{tx.userRole}</TableCell>
                  <TableCell className="font-semibold">{tx.planName}</TableCell>
                  <TableCell className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${tx.amount} {tx.currency}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {tx.transactionId}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(tx.paidAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
