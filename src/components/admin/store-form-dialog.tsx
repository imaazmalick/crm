"use client";

import type React from "react";

import { useState } from "react";
import { createStore, updateStore } from "@/actions/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Store {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface StoreFormDialogProps {
  store?: Store;
  trigger?: React.ReactNode;
}

export function StoreFormDialog({ store, trigger }: StoreFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = store
      ? await updateStore(store.id, formData)
      : await createStore(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setOpen(false);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Store
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{store ? "Edit Store" : "Add New Store"}</DialogTitle>
          <DialogDescription>
            {store
              ? "Update store information below"
              : "Enter store information and create store manager account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <h3 className="text-sm font-semibold mb-3">Store Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={store?.name}
                    placeholder="Main Store"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Store Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={store?.email}
                    placeholder="store@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={store?.phone}
                    placeholder="+92 300 1234567"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={store?.address}
                    placeholder="123 Main St"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={store?.city}
                    placeholder="Karachi"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    defaultValue={store?.state}
                    placeholder="Sindh"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    defaultValue={store?.zipCode}
                    placeholder="75500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {!store && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Store Manager Account
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create login credentials for the store manager
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="managerName">Manager Name</Label>
                      <Input
                        id="managerName"
                        name="managerName"
                        placeholder="John Doe"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="managerEmail">Manager Email</Label>
                      <Input
                        id="managerEmail"
                        name="managerEmail"
                        type="email"
                        placeholder="manager@example.com"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="managerPassword">Manager Password</Label>
                      <Input
                        id="managerPassword"
                        name="managerPassword"
                        type="password"
                        placeholder="Minimum 8 characters"
                        minLength={8}
                        required
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        The manager will use this email and password to login
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {store ? "Updating..." : "Creating..."}
                </>
              ) : store ? (
                "Update Store"
              ) : (
                "Create Store & Manager"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
