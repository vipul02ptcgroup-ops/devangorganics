"use client";

import type { LucideIcon } from "lucide-react";

type AdminPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  highlights: string[];
};

export default function AdminPlaceholder({
  eyebrow,
  title,
  description,
  Icon,
  highlights,
}: AdminPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] mb-2">{eyebrow}</p>
          <h1 className="font-[Cinzel] text-3xl text-[#F5F0E8]">{title}</h1>
          <p className="text-[#666] text-sm mt-2 max-w-2xl leading-6">{description}</p>
        </div>
        <div className="w-14 h-14 border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0">
          <Icon className="text-[#C9A84C]" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlights.map((item, index) => (
          <div key={item} className="bg-[#161616] border border-[#1A1A1A] p-5">
            <p className="text-[#666] text-xs tracking-[0.2em] mb-3">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="text-[#C8C0B0] text-sm leading-6">{item}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-[#1A1A1A] p-6 md:p-8">
        <h2 className="font-[Cinzel] text-[#C9A84C] text-sm tracking-[0.2em] mb-4">
          PLACEHOLDER MODULE
        </h2>
        <div className="border border-dashed border-[#2A2A2A] bg-[#111111] px-6 py-10 text-center">
          <p className="text-[#F5F0E8] text-lg font-[Cinzel] mb-2">{title} coming next</p>
          <p className="text-[#666] text-sm max-w-xl mx-auto leading-6">
            This area is ready for real admin functionality once you want to connect
            products, orders, and user management to live backend data.
          </p>
        </div>
      </div>
    </div>
  );
}
