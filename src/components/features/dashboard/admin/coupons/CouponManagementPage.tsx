"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { TicketPercent, Percent, WalletCards } from "lucide-react";
import { toast } from "sonner";

import { DashboardStatCard } from "@/components/features/dashboard/shared/DashboardStatCard";
import { DashboardSkeleton } from "@/components/features/dashboard/shared/dashboard-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { couponService } from "@/service/coupon.service";
import type {
  CreateCouponPayload,
  Coupon,
  CouponDiscountType,
  UpdateCouponPayload,
} from "@/types/coupon.types";

type FilterMode = "ALL" | "ACTIVE" | "INACTIVE";

type CouponFormState = {
  code: string;
  discountType: CouponDiscountType;
  discountValue: string;
  minBookingAmount: string;
  maxDiscountAmount: string;
  usageLimit: string;
  expiresAt: string;
  isActive: boolean;
};

const defaultFormState: CouponFormState = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minBookingAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

// HELPERS
const toDateTimeLocalValue = (value: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hour = String(parsed.getHours()).padStart(2, "0");
  const minute = String(parsed.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const toFormStateFromCoupon = (coupon: Coupon): CouponFormState => ({
  code: coupon.code,
  discountType: coupon.discountType,
  discountValue: String(coupon.discountValue ?? ""),
  minBookingAmount:
    coupon.minBookingAmount === null ? "" : String(coupon.minBookingAmount),
  maxDiscountAmount:
    coupon.maxDiscountAmount === null ? "" : String(coupon.maxDiscountAmount),
  usageLimit: coupon.usageLimit === null ? "" : String(coupon.usageLimit),
  expiresAt: toDateTimeLocalValue(coupon.expiresAt),
  isActive: coupon.isActive,
});

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatDateLabel = (value: string | null) => {
  if (!value) return "Never";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Invalid date";

  return format(parsed, "MMM dd, yyyy");
};

const formatDiscountLabel = (
  type: CouponDiscountType,
  discountValue: string | number,
  maxDiscountAmount: string | number | null,
) => {
  const value = Number(discountValue ?? 0);

  if (type === "PERCENTAGE") {
    const max =
      maxDiscountAmount === null ? null : Number(maxDiscountAmount ?? 0);

    if (max && max > 0) {
      return `${value}% (max ${max})`;
    }

    return `${value}%`;
  }

  return `${value}`;
};

export default function CouponManagementPage() {
  const queryClient = useQueryClient();

  // STATES
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponFormState>(defaultFormState);

  // QUERY FOR ADMIN COUPONS
  const couponsQuery = useQuery({
    queryKey: ["admin-coupons", search],
    queryFn: () =>
      couponService.getAdminCoupons({
        page: 1,
        limit: 200,
        sortBy: "-createdAt",
        searchTerm: search.trim() || undefined,
      }),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  // MEMOIZED COUPONS
  const coupons = useMemo(
    () => couponsQuery.data?.data ?? [],
    [couponsQuery.data?.data],
  );

  // MEMOIZED ROWS
  const rows = useMemo(() => {
    if (filterMode === "ACTIVE") return coupons.filter((item) => item.isActive);
    if (filterMode === "INACTIVE") {
      return coupons.filter((item) => !item.isActive);
    }

    return coupons;
  }, [coupons, filterMode]);

  // MEMOIZED ACTIVE COUNT
  const activeCount = coupons.filter((item) => item.isActive).length;
  // MEMOIZED PERCENTAGE COUNT
  const percentageCount = coupons.filter(
    (item) => item.discountType === "PERCENTAGE",
  ).length;

  // MUTATIONS
  const createCouponMutation = useMutation({
    mutationFn: (payload: CreateCouponPayload) =>
      couponService.createCoupon(payload),
    onSuccess: async () => {
      toast.success("Coupon created successfully");
      setOpenFormDialog(false);
      setEditingCoupon(null);
      setForm(defaultFormState);
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create coupon",
      );
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({
      couponId,
      payload,
    }: {
      couponId: string;
      payload: UpdateCouponPayload;
    }) => couponService.updateCoupon(couponId, payload),
    onSuccess: async () => {
      toast.success("Coupon updated successfully");
      setOpenFormDialog(false);
      setEditingCoupon(null);
      setForm(defaultFormState);
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update coupon",
      );
    },
  });

  const toggleCouponStatusMutation = useMutation({
    mutationFn: ({
      couponId,
      isActive,
    }: {
      couponId: string;
      isActive: boolean;
    }) => couponService.updateCoupon(couponId, { isActive }),
    onSuccess: async (_result, variables) => {
      toast.success(
        variables.isActive ? "Coupon activated" : "Coupon deactivated",
      );
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update coupon",
      );
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (couponId: string) => couponService.deleteCoupon(couponId),
    onSuccess: async () => {
      toast.success("Coupon deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete coupon",
      );
    },
  });

  // HANDLER
  const handleSubmitCoupon = () => {
    const code = form.code.trim().toUpperCase();
    const discountValue = toNumber(form.discountValue);

    if (!code || !discountValue || discountValue <= 0) {
      toast.error("Coupon code and a positive discount value are required");
      return;
    }

    const createPayload: CreateCouponPayload = {
      code,
      discountType: form.discountType,
      discountValue,
      isActive: form.isActive,
    };

    const updatePayload: UpdateCouponPayload = {
      code,
      discountType: form.discountType,
      discountValue,
      isActive: form.isActive,
    };

    const minBookingAmount = toNumber(form.minBookingAmount);
    if (minBookingAmount !== undefined) {
      createPayload.minBookingAmount = minBookingAmount;
      updatePayload.minBookingAmount = minBookingAmount;
    } else if (editingCoupon) {
      updatePayload.minBookingAmount = null;
    }

    const usageLimit = toNumber(form.usageLimit);
    if (usageLimit !== undefined) {
      createPayload.usageLimit = usageLimit;
      updatePayload.usageLimit = usageLimit;
    } else if (editingCoupon) {
      updatePayload.usageLimit = null;
    }

    if (form.discountType === "PERCENTAGE") {
      const maxDiscountAmount = toNumber(form.maxDiscountAmount);
      if (maxDiscountAmount !== undefined) {
        createPayload.maxDiscountAmount = maxDiscountAmount;
        updatePayload.maxDiscountAmount = maxDiscountAmount;
      } else if (editingCoupon) {
        updatePayload.maxDiscountAmount = null;
      }
    } else if (editingCoupon) {
      updatePayload.maxDiscountAmount = null;
    }

    if (form.expiresAt) {
      const isoDate = new Date(form.expiresAt).toISOString();
      createPayload.expiresAt = isoDate;
      updatePayload.expiresAt = isoDate;
    } else if (editingCoupon) {
      updatePayload.expiresAt = null;
    }

    if (editingCoupon) {
      updateCouponMutation.mutate({
        couponId: editingCoupon.id,
        payload: updatePayload,
      });
      return;
    }

    createCouponMutation.mutate(createPayload);
  };

  if (couponsQuery.isPending) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-primary md:text-5xl">
          Coupon Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and control promotional coupons that users can apply during
          booking.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Total Coupons"
          value={String(coupons.length)}
          icon={TicketPercent}
          subtitle="All coupon codes"
        />
        <DashboardStatCard
          label="Active Coupons"
          value={String(activeCount)}
          icon={WalletCards}
          subtitle="Currently eligible for bookings"
        />
        <DashboardStatCard
          label="Percentage Coupons"
          value={String(percentageCount)}
          icon={Percent}
          subtitle="Percent based discount strategy"
          accent
        />
      </div>

      <Card className="rounded-none border border-border bg-card">
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="font-heading text-lg font-black uppercase tracking-tight text-primary">
              Coupons Table
            </CardTitle>

            <Dialog
              open={openFormDialog}
              onOpenChange={(nextOpen) => {
                setOpenFormDialog(nextOpen);
                if (!nextOpen) {
                  setEditingCoupon(null);
                  setForm(defaultFormState);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-none"
                  onClick={() => {
                    setEditingCoupon(null);
                    setForm(defaultFormState);
                  }}
                >
                  Add Coupon
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-xl rounded-none">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl font-black uppercase tracking-tight text-primary">
                    {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCoupon
                      ? "Update discount details, expiry and usage control for this coupon."
                      : "Configure discount details, expiry and usage control for a new coupon."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="coupon-code">Coupon Code</Label>
                    <Input
                      id="coupon-code"
                      value={form.code}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          code: event.target.value,
                        }))
                      }
                      placeholder="WELCOME10"
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coupon-type">Discount Type</Label>
                    <select
                      id="coupon-type"
                      value={form.discountType}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          discountType: event.target
                            .value as CouponDiscountType,
                          maxDiscountAmount:
                            event.target.value === "FIXED"
                              ? ""
                              : prev.maxDiscountAmount,
                        }))
                      }
                      className="h-9 w-full rounded-none border border-input bg-transparent px-3 text-sm"
                    >
                      <option value="PERCENTAGE">PERCENTAGE</option>
                      <option value="FIXED">FIXED</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount-value">Discount Value</Label>
                    <Input
                      id="discount-value"
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.discountValue}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          discountValue: event.target.value,
                        }))
                      }
                      placeholder={
                        form.discountType === "PERCENTAGE" ? "10" : "50"
                      }
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-booking-amount">
                      Min Booking Amount
                    </Label>
                    <Input
                      id="min-booking-amount"
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.minBookingAmount}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          minBookingAmount: event.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usage-limit">Usage Limit</Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      min={1}
                      step="1"
                      value={form.usageLimit}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          usageLimit: event.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires-at">Expires At</Label>
                    <Input
                      id="expires-at"
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          expiresAt: event.target.value,
                        }))
                      }
                      className="rounded-none"
                    />
                  </div>

                  {form.discountType === "PERCENTAGE" && (
                    <div className="space-y-2">
                      <Label htmlFor="max-discount-amount">
                        Max Discount Amount
                      </Label>
                      <Input
                        id="max-discount-amount"
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.maxDiscountAmount}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            maxDiscountAmount: event.target.value,
                          }))
                        }
                        placeholder="Optional"
                        className="rounded-none"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-sm font-medium text-primary md:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          isActive: event.target.checked,
                        }))
                      }
                    />
                    Activate this coupon right away
                  </label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none"
                    onClick={() => {
                      setOpenFormDialog(false);
                      setEditingCoupon(null);
                      setForm(defaultFormState);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-none"
                    disabled={
                      createCouponMutation.isPending ||
                      updateCouponMutation.isPending
                    }
                    onClick={handleSubmitCoupon}
                  >
                    {createCouponMutation.isPending ||
                    updateCouponMutation.isPending
                      ? editingCoupon
                        ? "Updating..."
                        : "Creating..."
                      : editingCoupon
                        ? "Update Coupon"
                        : "Create Coupon"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {(
                [
                  { key: "ALL", label: "All" },
                  { key: "ACTIVE", label: "Active" },
                  { key: "INACTIVE", label: "Inactive" },
                ] as const
              ).map((item) => (
                <Button
                  key={item.key}
                  type="button"
                  variant={filterMode === item.key ? "secondary" : "outline"}
                  className={cn(
                    "rounded-none",
                    filterMode === item.key && "text-primary",
                  )}
                  onClick={() => setFilterMode(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search coupon code"
              className="h-9 w-full rounded-none md:w-72"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-none border border-border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Min Amount</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {couponsQuery.isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <LoadingSpinner
                        label="Loading coupons..."
                        className="justify-center"
                      />
                    </TableCell>
                  </TableRow>
                )}

                {!couponsQuery.isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No coupons found for this filter.
                    </TableCell>
                  </TableRow>
                )}

                {!couponsQuery.isLoading &&
                  rows.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-semibold text-primary">
                        {coupon.code}
                      </TableCell>
                      <TableCell>
                        {formatDiscountLabel(
                          coupon.discountType,
                          coupon.discountValue,
                          coupon.maxDiscountAmount,
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.usedCount}
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                      </TableCell>
                      <TableCell>
                        {coupon.minBookingAmount === null
                          ? "-"
                          : Number(coupon.minBookingAmount)}
                      </TableCell>
                      <TableCell>{formatDateLabel(coupon.expiresAt)}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.14em]",
                            coupon.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-zinc-200 text-zinc-700",
                          )}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-none"
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setForm(toFormStateFromCoupon(coupon));
                              setOpenFormDialog(true);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant={coupon.isActive ? "outline" : "secondary"}
                            className="rounded-none"
                            disabled={toggleCouponStatusMutation.isPending}
                            onClick={() =>
                              toggleCouponStatusMutation.mutate({
                                couponId: coupon.id,
                                isActive: !coupon.isActive,
                              })
                            }
                          >
                            {coupon.isActive ? "Deactivate" : "Activate"}
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="rounded-none"
                            disabled={deleteCouponMutation.isPending}
                            onClick={() =>
                              deleteCouponMutation.mutate(coupon.id)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
