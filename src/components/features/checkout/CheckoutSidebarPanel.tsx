type CheckoutSidebarPanelProps = {
  totalAmount: number;
  loading: boolean;
  isExpired: boolean;
};

// CONSTANTS
const formatMoney = (amount: number) => {
  return `USD ${amount.toFixed(2)}`;
};

export function CheckoutSidebarPanel({
  totalAmount,
  loading,
  isExpired,
}: CheckoutSidebarPanelProps) {
  const subtotal = totalAmount;
  const serviceFee = 0;

  return (
    <aside className="lg:w-105">
      <div className="sticky top-28 space-y-10 bg-[radial-gradient(circle_at_top_right,#0b3f2b_0%,#012d1d_45%,#00160c_100%)] p-8 text-primary-foreground">
        <div className="space-y-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary">
            Summary
          </h3>

          <div className="space-y-3 font-heading text-sm">
            <div className="flex items-center justify-between opacity-75">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-secondary">
              <span>Payment Method</span>
              <span>Card</span>
            </div>
            <div className="flex items-center justify-between opacity-75">
              <span>Service Fee</span>
              <span>{formatMoney(serviceFee)}</span>
            </div>

            <div className="my-6 h-px bg-white/10" />

            <div className="flex items-end justify-between">
              <span className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] opacity-75">
                Total Amount
              </span>
              <span className="text-4xl font-black tracking-tight">
                {formatMoney(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <button
            type="submit"
            disabled={loading || isExpired}
            className="h-14 w-full bg-secondary text-sm font-black uppercase tracking-[0.2em] text-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExpired
              ? "Booking Expired"
              : loading
                ? "Processing..."
                : "Pay Now"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center gap-2 bg-white/5 p-3 text-center">
              <span className="text-secondary">O</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] opacity-80">
                Secure Transaction
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white/5 p-3 text-center">
              <span className="text-secondary">*</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] opacity-80">
                Instant Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
