"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  Eye,
  Search,
  X,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ApiRequestError, apiRequest, createAuthHeaders } from "@/lib/client-api";
import type { OrderRecord, OrderStatus } from "@/lib/api-types";
import { useAuth } from "@/lib/auth";
import { getAllOrdersClient } from "@/lib/orders-client";

function isServiceUnavailableError(error: unknown) {
  return error instanceof ApiRequestError && error.status === 503;
}

const statusOptions: Array<{ label: string; value: "all" | OrderStatus }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "placed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

function formatOrderDate(value?: string | null) {
  if (!value) {
    return "Pending";
  }

  return new Date(value).toLocaleDateString("en-IN");
}

function formatCurrency(value: number) {
  return `Rs${value.toLocaleString("en-IN")}`;
}

function getStatusCount(orders: OrderRecord[], status: "all" | OrderStatus) {
  if (status === "all") {
    return orders.length;
  }

  return orders.filter((order) => order.orderStatus === status).length;
}

function getOrderItemsCount(order: OrderRecord) {
  return order.products.reduce((sum, product) => sum + product.quantity, 0);
}

function getOrderDisplayId(order: OrderRecord) {
  return order.id;
}

function getCustomerInitials(order: OrderRecord) {
  return order.customerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function buildInvoiceHtml(order: OrderRecord) {
  const itemsMarkup = order.products
    .map(
      (product, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>Rs${product.price.toLocaleString("en-IN")}</td>
          <td>Rs${(product.price * product.quantity).toLocaleString("en-IN")}</td>
        </tr>
      `
    )
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Invoice ${getOrderDisplayId(order)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 24px;
          color: #111827;
          background: #ffffff;
        }
        .invoice {
          max-width: 920px;
          margin: 0 auto;
          border: 1px solid #e5e7eb;
          padding: 32px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .brand {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .brand img {
          height: 72px;
          width: auto;
          object-fit: contain;
        }
        .brand-copy {
          font-size: 12px;
          letter-spacing: 0.2em;
          color: #6b7280;
        }
        .title {
          text-align: right;
        }
        .title h1 {
          margin: 0;
          font-size: 38px;
        }
        .meta {
          font-size: 14px;
          margin-top: 8px;
          line-height: 1.6;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .panel {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
        }
        .panel h2 {
          margin: 0 0 12px;
          font-size: 20px;
        }
        .panel p {
          margin: 4px 0;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th, td {
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 10px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background: #f8fafc;
        }
        .summary {
          margin-left: auto;
          width: 320px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
        }
        .grand-total {
          border-top: 1px solid #d1d5db;
          padding-top: 12px;
          margin-top: 12px;
          font-weight: 700;
          font-size: 22px;
        }
        .footer {
          margin-top: 48px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="brand">
            <img src="${window.location.origin}/Images/Logo.png" alt="Devang Organics" />
            <div class="brand-copy">DEVANG ORGANICS</div>
          </div>
          <div class="title">
            <h1>TAX INVOICE</h1>
            <div class="meta">
              <div>Invoice No: ${getOrderDisplayId(order)}</div>
              <div>Issue Date: ${formatOrderDate(order.createdAt)}</div>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="panel">
            <h2>Billed To</h2>
            <p><strong>${order.customerName}</strong></p>
            <p>${order.address || "-"}</p>
            <p>${order.email}</p>
            <p>${order.phone}</p>
          </div>
          <div class="panel">
            <h2>Order Summary</h2>
            <p>Payment: ${order.orderType}</p>
            <p>Status: ${order.orderStatus}</p>
            <p>Items: ${getOrderItemsCount(order)}</p>
            <p>Total: ${formatCurrency(order.totalAmount)}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>${itemsMarkup}</tbody>
        </table>

        <div class="summary">
          <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(order.totalAmount)}</span></div>
          <div class="summary-row"><span>Shipping</span><span>Rs0</span></div>
          <div class="summary-row"><span>Payment</span><span>${order.paymentStatus}</span></div>
          <div class="summary-row"><span>Method</span><span>${order.orderType}</span></div>
          <div class="summary-row grand-total"><span>Grand Total</span><span>${formatCurrency(order.totalAmount)}</span></div>
        </div>

        <div class="footer">
          System generated invoice for order ${getOrderDisplayId(order)}.
        </div>
      </div>
    </body>
  </html>`;
}

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [draftStatus, setDraftStatus] = useState<OrderStatus>("placed");
  const [internalNote, setInternalNote] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const headers = await createAuthHeaders(user);
        const response = await apiRequest<{ orders: OrderRecord[] }>(
          "/api/admin/orders",
          {
            headers,
          }
        );

        if (!cancelled) {
          setOrders(response.orders);
        }
      } catch (nextError) {
        if (isServiceUnavailableError(nextError)) {
          try {
            const fallbackOrders = await getAllOrdersClient();
            if (!cancelled) {
              setOrders(fallbackOrders);
            }
            return;
          } catch (fallbackError) {
            if (!cancelled) {
              setError(
                fallbackError instanceof Error
                  ? fallbackError.message
                  : "Failed to load orders."
              );
            }
            return;
          }
        }

        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Failed to load orders."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!selectedOrder) {
      return;
    }

    setDraftStatus(selectedOrder.orderStatus);
    setInternalNote("");
    setStatusMessage("");
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.email.toLowerCase().includes(normalizedSearch) ||
        getOrderDisplayId(order).toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const filteredTotal = useMemo(
    () => filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    [filteredOrders]
  );

  const handleOpenOrder = (order: OrderRecord) => {
    setSelectedOrder(order);
    setDraftStatus(order.orderStatus);
    setInternalNote("");
    setStatusMessage("");
  };

  const handleSaveOrderChanges = () => {
    if (!selectedOrder) {
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, orderStatus: draftStatus }
          : order
      )
    );

    setSelectedOrder((current) =>
      current ? { ...current, orderStatus: draftStatus } : current
    );
    setStatusMessage("Order status updated in the admin view.");
  };

  const handleDownloadInvoice = (order: OrderRecord) => {
    const invoiceWindow = window.open("", "_blank", "width=960,height=900");
    if (!invoiceWindow) {
      return;
    }

    invoiceWindow.document.write(buildInvoiceHtml(order));
    invoiceWindow.document.close();
    invoiceWindow.focus();
    invoiceWindow.print();
  };

  const handleExportOrders = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Phone",
      "Address",
      "Items",
      "Total",
      "Payment Status",
      "Order Status",
      "Order Type",
      "Created",
    ];

    const rows = filteredOrders.map((order) => [
      getOrderDisplayId(order),
      order.customerName,
      order.email,
      order.phone,
      order.address,
      String(getOrderItemsCount(order)),
      String(order.totalAmount),
      order.paymentStatus,
      order.orderStatus,
      order.orderType,
      order.createdAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[Cinzel] text-4xl text-[#F5F0E8]">Orders</h1>
            <p className="text-[#666] text-sm mt-2">{orders.length} total orders</p>
          </div>

          <button
            onClick={handleExportOrders}
            className="flex items-center gap-2 px-5 py-3 border border-[#2A2A2A] bg-[#161616] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {statusOptions.map((option) => {
            const isActive = statusFilter === option.value;
            const count = getStatusCount(orders, option.value);

            return (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`rounded-2xl border px-5 py-6 text-left transition-colors ${
                  isActive
                    ? "border-[#C9A84C]/50 bg-[#C9A84C]/10"
                    : "border-[#1A1A1A] bg-[#161616] hover:border-[#C9A84C]/30"
                }`}
              >
                <p className="font-[Cinzel] text-3xl text-[#F5F0E8]">{count}</p>
                <p
                  className={`mt-2 text-sm ${
                    isActive ? "text-[#C9A84C]" : "text-[#666]"
                  }`}
                >
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>

        <div className="bg-[#161616] border border-[#1A1A1A] rounded-3xl p-5">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by customer or order ID..."
                className="w-full rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div className="relative min-w-[170px]">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | OrderStatus)
                }
                className="w-full appearance-none rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F0E8] px-4 py-3.5 pr-10 text-sm focus:outline-none focus:border-[#C9A84C]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#161616] border border-[#1A1A1A] rounded-3xl p-6 text-[#C9A84C]">
            Loading orders...
          </div>
        ) : error ? (
          <div className="bg-[#161616] border border-red-500/30 rounded-3xl p-6 text-red-300">
            {error}
          </div>
        ) : (
          <div className="bg-[#161616] border border-[#1A1A1A] rounded-3xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#1A1A1A] bg-[#111]">
                  {["ORDER ID", "CUSTOMER", "DATE", "ITEMS", "TOTAL", "STATUS", "ACTIONS"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="text-left text-[#666] text-xs tracking-wider px-5 py-4 font-normal"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-14 text-center text-sm text-[#666]"
                    >
                      No orders match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#111] hover:bg-[#111] transition-colors"
                    >
                      <td className="px-5 py-5 text-[#C9A84C] font-semibold">
                        {getOrderDisplayId(order)}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1E1E1E] text-[#C8C0B0] flex items-center justify-center text-sm">
                            {getCustomerInitials(order) || "CU"}
                          </div>
                          <div>
                            <p className="text-[#F5F0E8] text-sm font-semibold">
                              {order.customerName}
                            </p>
                            <p className="text-[#666] text-xs">{order.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-[#C8C0B0] text-sm">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-5 text-[#C8C0B0] text-sm">
                        {getOrderItemsCount(order)}
                      </td>
                      <td className="px-5 py-5 text-[#F5F0E8] text-sm font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-5 py-5">
                        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 capitalize">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <button
                          onClick={() => handleOpenOrder(order)}
                          className="w-10 h-10 rounded-full border border-[#2A2A2A] bg-[#111] text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#C9A84C] flex items-center justify-center transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between gap-4 px-5 py-5 text-sm text-[#666]">
              <p>
                {filteredOrders.length} orders · Total:{" "}
                <span className="text-[#F5F0E8] font-semibold">
                  {formatCurrency(filteredTotal)}
                </span>
              </p>
              <p>
                Showing <span className="text-[#C9A84C]">{filteredOrders.length}</span>{" "}
                of {orders.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedOrder ? (
        <div className="fixed inset-0 z-[120]">
          <button
            aria-label="Close order details"
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-[560px] bg-[#111111] border-l border-[#1A1A1A] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-[#111111] border-b border-[#1A1A1A] flex items-center justify-between px-7 py-6">
              <h2 className="font-[Cinzel] text-3xl text-[#F5F0E8]">
                Order {getOrderDisplayId(selectedOrder)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#666] hover:text-[#F5F0E8] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-7 space-y-8">
              <div className="rounded-3xl border border-[#1A1A1A] bg-[#161616] p-6 space-y-4">
                {[
                  ["Customer", selectedOrder.customerName],
                  ["Email", selectedOrder.email],
                  ["Phone", selectedOrder.phone],
                  ["Date", formatOrderDate(selectedOrder.createdAt)],
                  ["Items", `${getOrderItemsCount(selectedOrder)} items`],
                  ["Payment", selectedOrder.orderType],
                  ["Address", selectedOrder.address || "-"],
                  ["Total", formatCurrency(selectedOrder.totalAmount)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4"
                  >
                    <span className="text-[#666]">{label}</span>
                    <span className="text-[#F5F0E8] text-right font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-[#F5F0E8] text-xl font-semibold mb-4">
                  Update Status
                </h3>
                <div className="relative">
                  <select
                    value={draftStatus}
                    onChange={(event) =>
                      setDraftStatus(event.target.value as OrderStatus)
                    }
                    className="w-full appearance-none rounded-2xl bg-[#161616] border border-[#2A2A2A] text-[#F5F0E8] px-4 py-4 pr-10 text-sm focus:outline-none focus:border-[#C9A84C]"
                  >
                    {statusOptions
                      .filter((option) => option.value !== "all")
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[#F5F0E8] text-xl font-semibold mb-4">
                  Ordered Products
                </h3>
                <div className="space-y-3">
                  {selectedOrder.products.map((product, index) => (
                    <div
                      key={`${selectedOrder.id}-${product.id}-${index}`}
                      className="rounded-3xl border border-[#1A1A1A] bg-[#161616] p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-[#666] text-xs">No image</div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#F5F0E8] font-semibold">
                            {product.name}
                          </p>
                          <p className="text-[#666] text-sm">
                            Qty: {product.quantity} x {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>
                      <p className="text-[#F5F0E8] font-semibold">
                        {formatCurrency(product.price * product.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[#F5F0E8] text-xl font-semibold mb-4">Note</h3>
                <textarea
                  value={internalNote}
                  onChange={(event) => setInternalNote(event.target.value)}
                  placeholder="Add internal note..."
                  rows={4}
                  className="w-full rounded-2xl bg-[#161616] border border-[#2A2A2A] text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
                />
              </div>

              {statusMessage ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-3 text-sm">
                  {statusMessage}
                </div>
              ) : null}

              <button
                onClick={() => handleDownloadInvoice(selectedOrder)}
                className="w-full rounded-2xl border border-[#2A2A2A] bg-[#161616] px-5 py-4 text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
              >
                Download Invoice
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 rounded-2xl border border-[#2A2A2A] px-5 py-4 text-[#C8C0B0] hover:border-[#C9A84C] hover:text-[#F5F0E8] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveOrderChanges}
                  className="flex-1 rounded-2xl px-5 py-4 text-[#0A0A0A] font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
