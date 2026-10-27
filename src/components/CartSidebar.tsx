"use client";

import { useState } from "react";
import { money } from "@/lib/formatters.js";
import { type CraCategory, CRA_CATEGORIES } from "@/components/RateList";

export interface CartItem {
  id: string;
  type: "profile" | "test";
  code?: string;
  name: string;
  b2c: number;
  quantity: number;
  details?: string;
  testCount?: number;
}

export interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart?: () => void;
  craCategory: CraCategory;
  onSelectCategory?: (category: CraCategory) => void;
}

export const MIN_CART_VALUE = 250;

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  craCategory,
}: CartSidebarProps) {
  const [copied, setCopied] = useState(false);
  const whatsappNumber = "919699690289";

  if (!isOpen) return null;

  const totalItemsCount = cart.length;
  const totalCatalogue = cart.reduce((sum, item) => sum + item.b2c * item.quantity, 0);

  // Business Logic: Minimum cart value is ₹250.
  // Below ₹250, NO customer discount and NO CRA incentive applies.
  const isMinCartMet = totalCatalogue >= MIN_CART_VALUE;
  const meta = CRA_CATEGORIES[craCategory] || CRA_CATEGORIES.C4000;

  const customerDiscountPct = isMinCartMet ? meta.customerDiscountPct : 0;
  const craIncentivePct = isMinCartMet ? meta.craIncentivePctOnRealized : 0;

  const totalCustomerDiscount = Math.round(totalCatalogue * customerDiscountPct);
  const totalCustomerPrice = totalCatalogue - totalCustomerDiscount;
  const totalCraIncentive = Math.round(totalCustomerPrice * craIncentivePct);
  const amountNeeded = Math.max(0, MIN_CART_VALUE - totalCatalogue);
  const progressPct = Math.min(100, Math.round((totalCatalogue / MIN_CART_VALUE) * 100));

  // Build WhatsApp referral message
  const referralLines = [
    "Dear AVMLabs Team,",
    "I would like to refer a customer for the following tests/profiles:",
    "",
    ...cart.map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (${item.type.toUpperCase()}) - ${money(item.b2c)}`
    ),
    "",
    `CRA Category: ${craCategory} (${meta.label})`,
    `Total Catalogue Value: ${money(totalCatalogue)}`,
    isMinCartMet
      ? `Customer Discount: ${money(totalCustomerDiscount)} (${Math.round(
          meta.customerDiscountPct * 100
        )}% off)\nCustomer Payable: ${money(totalCustomerPrice)}\nPartner CRA Incentive: ${money(
          totalCraIncentive
        )}`
      : `Customer Payable: ${money(
          totalCustomerPrice
        )} (Standard Catalogue Rate - Below ₹250 minimum order)\nPartner CRA Incentive: ₹0`,
    "",
    "Please assist with the customer booking."
  ];

  const whatsappMessage = referralLines.join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy cart quotation:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1c1950] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                🛒
              </div>
              <div>
                <h3 className="font-sans font-bold text-slate-900 text-base leading-tight">
                  Referral Cart
                </h3>
                <p className="text-xs text-slate-500">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart sidebar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Minimum Cart Value Banner (₹250 Rule) */}
          <div className="px-5 py-3 border-b border-slate-200 shrink-0">
            {cart.length === 0 ? (
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>ℹ️</span>
                <span>Minimum cart value for discount & CRA incentive is <strong>₹250</strong>.</span>
              </div>
            ) : !isMinCartMet ? (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-sm font-bold shrink-0 mt-0.5">⚠️</span>
                  <div className="text-xs text-amber-900 leading-snug">
                    <p className="font-bold">Minimum cart value is ₹250</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      No customer discount & no CRA incentive on orders under ₹250. Add{" "}
                      <strong className="text-amber-950 font-bold">{money(amountNeeded)}</strong>{" "}
                      more to unlock CRA benefits!
                    </p>
                  </div>
                </div>

                <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                  <span>Current: {money(totalCatalogue)}</span>
                  <span>Target: ₹250</span>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div className="text-xs text-emerald-900">
                  <span className="font-bold">Minimum cart value reached!</span>
                  <span className="block text-[11px] text-emerald-700">
                    CRA benefits unlocked ({Math.round(meta.customerDiscountPct * 100)}% customer discount & partner incentives active).
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-3">
                  📋
                </div>
                <p className="font-bold text-slate-700 text-base mb-1">
                  Your cart is empty
                </p>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Click the <strong className="text-[#1c1950] font-bold">+</strong> button on any test or package in the rate list to add it to your referral cart.
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = item.b2c * item.quantity;
                return (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              item.type === "profile"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-sky-50 text-sky-700 border border-sky-200"
                            }`}
                          >
                            {item.type}
                          </span>
                          {item.code && (
                            <span className="font-mono text-[10px] text-slate-500">
                              {item.code}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Rate: {money(item.b2c)}
                        </div>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 text-sm block">
                          {money(itemTotal)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-slate-400 hover:text-rose-600 text-xs font-semibold mt-1 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Savings pill if min cart met */}
                    {isMinCartMet && meta.customerDiscountPct > 0 && (
                      <div className="flex justify-end pt-0.5">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          Save {Math.round(meta.customerDiscountPct * 100)}% (
                          {money(Math.round(itemTotal * meta.customerDiscountPct))})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Breakdown & Action Buttons */}
          {cart.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50/90 space-y-3 shrink-0">
              {/* Calculations Summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Catalogue Rate Total</span>
                  <span className="font-semibold text-slate-900">{money(totalCatalogue)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Customer Discount</span>
                  <span
                    className={`font-semibold ${
                      isMinCartMet && totalCustomerDiscount > 0
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {isMinCartMet
                      ? totalCustomerDiscount > 0
                        ? `-${money(totalCustomerDiscount)} (${Math.round(
                            meta.customerDiscountPct * 100
                          )}%)`
                        : "₹0 (0%)"
                      : "₹0 (Min ₹250 required)"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-sm font-bold">
                  <span className="text-slate-900">Customer Pays</span>
                  <span className="text-[#1c1950] text-base">{money(totalCustomerPrice)}</span>
                </div>

                {/* Partner CRA Incentive Row */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF4EB] border border-[#ECDDC7] text-xs">
                  <div>
                    <span className="font-bold text-[#0F2A43] block">
                      Partner CRA Incentive
                    </span>
                    <span className="text-[10px] text-[#B8893B]">
                      {isMinCartMet
                        ? meta.craIncentivePctOnRealized > 0
                          ? `${Math.round(meta.craIncentivePctOnRealized * 100)}% on realized amount`
                          : "0% in C4000 model"
                        : "₹0 (Requires ₹250 min order)"}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#B8893B] text-base">
                    {money(totalCraIncentive)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1E9E4F] hover:bg-[#178441] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 fill-white shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.800s.7-2 1-2.300c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.200.1.300 0 .500l-.3.4-.4.400c-.1.1-.3.3-.1.600.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.2.4-.2.6-.1l1.900.9c.3.100.5.200.5.300.1.200.1.8-.1 1.400z" />
                  </svg>
                  <span>Refer via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  <span>{copied ? "✓ Copied Quotation!" : "📋 Copy Referral Summary"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
