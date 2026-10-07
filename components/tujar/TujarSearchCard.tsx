"use client";

import React, { useState } from "react";
import { TujarArrowLeft, TujarListNumberIcon, TujarUserListIcon } from "@/lib/tujar-icons";

interface TujarSearchCardProps {
  initialDocumentNumber?: string;
  initialSubscriptionNumber?: string;
  onSearch: (docOrOrderNo: string, subOrUnifiedNo: string, searchField: number) => void;
  isLoading?: boolean;
}

export function TujarSearchCard({
  initialDocumentNumber = "205-178",
  initialSubscriptionNumber = "205001150789",
  onSearch,
  isLoading = false,
}: TujarSearchCardProps) {
  const [searchField, setSearchField] = useState<number>(1); // 1: DocumentNumber, 2: OrderNumber
  const [docOrOrderNo, setDocOrOrderNo] = useState(initialDocumentNumber);
  const [subOrUnifiedNo, setSubOrUnifiedNo] = useState(initialSubscriptionNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docOrOrderNo.trim() || !subOrUnifiedNo.trim()) return;
    onSearch(docOrOrderNo.trim(), subOrUnifiedNo.trim(), searchField);
  };

  return (
    <div className="steeper-content" suppressHydrationWarning>
      {/* Header */}
      <div className="steeper-content__header">
        <h2 className="title">التحقق من الوثائق</h2>
        <a
          href="https://tujar.fsc.org.sa/"
          className="tujar-back-btn"
          title="الرئيسية"
          aria-label="العودة للرئيسية"
        >
          <TujarArrowLeft className="w-5 h-5" />
        </a>
      </div>

      <div className="steeper-content__body">
        <p className="text">
          خدمة تتيح التحقق من الوثائق التي تم تصديقها إلكترونيا عبر بوابة خدمات المشتركين.
          وللتحقق من شهادة الاشتراك الرجاء ادخال الرقم المرجعي أو رقم الطلب الخاص بالوثيقة.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search by using */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              بحث بأستخدام
            </label>
            <div className="relative">
              <select
                value={searchField}
                onChange={(e) => setSearchField(Number(e.target.value))}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#00997b] transition"
              >
                <option value={1}>الرقم المرجعي</option>
                <option value={2}>رقم الطلب</option>
              </select>
            </div>
          </div>

          {/* Document / Order Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              {searchField === 1 ? "الرقم المرجعي" : "رقم الطلب"}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                dir="ltr"
                value={docOrOrderNo}
                onChange={(e) => setDocOrOrderNo(e.target.value)}
                placeholder={searchField === 1 ? "مثال: 205-178" : "مثال: 205001150789"}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#00997b] transition pl-11"
                required
              />
              <span className="absolute left-3 text-gray-400 pointer-events-none">
                <TujarListNumberIcon className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>

        {/* Subscription or Unified Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            رقم العضوية / الرقم الموحد
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              dir="ltr"
              value={subOrUnifiedNo}
              onChange={(e) => setSubOrUnifiedNo(e.target.value)}
              placeholder="مثال: 205001150789 أو 7032840279"
              className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#00997b] transition pl-11"
              required
            />
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <TujarUserListIcon className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="uces-btn-primary"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري البحث...</span>
              </>
            ) : (
              <span>بحث</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
