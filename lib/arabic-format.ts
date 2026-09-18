/**
 * Pure client-safe and server-safe Arabic formatting utilities.
 * Zero Node.js dependencies (no fs, child_process, googleapis, etc.)
 */

/**
 * Converts a certificate record into the EXACT Arabic field structure
 * displayed on the main verification page (DocumentDetailsCard).
 * Pure Arabic with NO Urdu or internal artifacts.
 */
export function convertRecordToMainPageArabic(r: any): Record<string, any> {
  const serial = (r?.serialNumber || "").trim();
  const creationDate = r?.creationDate || "";
  const creationTime = r?.creationTime || "";
  const expiryDate = r?.expiryDate || "";
  const expiryTime = r?.expiryTime || "";

  // Official verification links matching portal format
  const baseUrlOrg = "https://verification-portal.org";
  const baseUrlCom = "https://verification-portal.com";
  const orgUrl = serial ? `${baseUrlOrg}/?doc=${encodeURIComponent(serial)}` : "";
  const comUrl = serial ? `${baseUrlCom}/?doc=${encodeURIComponent(serial)}` : "";

  return {
    "الرقم التسلسلي للوثيقة": serial,
    "إسم الغرفة": r?.chamberName || "",
    "إسم المنشأة": r?.facilityName || "",
    "نوع المنشأة": r?.facilitySubName || "",
    "الرقم الموحد (700)": r?.unifiedNumber || "",
    "رقم الطلب": r?.requestNumber || "",
    "نوع الطلب": r?.requestType || "",
    "إسم مقدم الطلب": r?.applicantName || "",
    "تاريخ ووقت إنشاء الطلب": `${creationDate} ${creationTime}`.trim(),
    "تاريخ الإنشاء": creationDate,
    "وقت الإنشاء": creationTime,
    "مبلغ الطلب": r?.amount || "",
    "تاريخ صلاحية الطلب": `${expiryDate} ${expiryTime}`.trim(),
    "تاريخ الإنتهاء": expiryDate,
    "وقت الإنتهاء": expiryTime,
    "رقم السجل التجاري": r?.commercialRegNo || "",
    "حالة الطلب": r?.requestStatus || "معتمد",
    "روابط التحقق الرسمية للمعاينة": {
      "رابط التحقق الأساسي (org)": orgUrl,
      "رابط التحقق البديل (com)": comUrl,
    },
    "أزرار ومرفقات الوثيقة": {
      "رابط ملف الوثيقة (PDF)": r?.downloadButton?.fileUrl || r?.downloadButton?.url || "",
      "إسم ملف الوثيقة": r?.downloadButton?.fileName || "",
      "رابط التحقق مرة آخرى": r?.verifyAgainButton?.url || "",
      "رابط زر العودة": r?.backButton?.url || "",
    },
    ...(Array.isArray(r?.customFields) && r.customFields.length > 0
      ? {
          "حقول إضافية": r.customFields.map((f: any) => ({
            "اسم الحقل": f?.label || "",
            "القيمة": f?.value || "",
          })),
        }
      : {}),
    "تاريخ التوثيق والتحديث": r?.updatedAt || r?.createdAt || new Date().toISOString(),
  };
}
