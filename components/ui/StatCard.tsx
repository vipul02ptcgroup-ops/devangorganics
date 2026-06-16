"use client";

import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
};

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-[#161616] border border-[#1A1A1A] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[#666] text-xs tracking-[0.2em]">{label}</p>
          <p className="font-[Cinzel] text-2xl text-[#C9A84C] mt-2">{value}</p>
        </div>
        {icon ? (
          <div className="w-10 h-10 border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
