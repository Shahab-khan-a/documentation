"use client";

import React from "react";
import { AdminLanguage } from "@/constants/translations";
import { DriveItem } from "@/hooks/useGoogleDrive";
import { IconDrive, IconTrash } from "@/components/icons/AdminIcons";

export interface GoogleDriveManagerModalProps {
  open: boolean;
  drivePickerTarget: "backButton" | "verifyAgainButton" | "downloadButton" | null;
  driveFiles: DriveItem[];
  loadingDriveFiles: boolean;
  updatingFileId: string | null;
  fileToDelete: DriveItem | null;
  deletingFileId: string | null;
  lang: AdminLanguage;
  isRtl: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onUploadDirect: (file: File) => void;
  onUpdateFile: (fileToUpdate: DriveItem, newFile: File) => void;
  onSelectForTarget: (
    target: "backButton" | "verifyAgainButton" | "downloadButton",
    file: DriveItem
  ) => void;
  onAssignToButton: (
    btnKey: "backButton" | "verifyAgainButton" | "downloadButton",
    file: DriveItem
  ) => void;
  onRequestDelete: (file: DriveItem) => void;
  onConfirmDelete: (file: DriveItem) => void;
  onCancelDelete: () => void;
  formatFileSize: (bytes?: number) => string;
}

export function GoogleDriveManagerModal({
  open,
  drivePickerTarget,
  driveFiles,
  loadingDriveFiles,
  updatingFileId,
  fileToDelete,
  deletingFileId,
  lang,
  isRtl,
  onClose,
  onRefresh,
  onUploadDirect,
  onUpdateFile,
  onSelectForTarget,
  onAssignToButton,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  formatFileSize,
}: GoogleDriveManagerModalProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-4.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <IconDrive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg">
                  {lang === "en"
                    ? "Google Drive Cloud Files"
                    : lang === "ur"
                    ? "گوگل ڈرائیو کلاؤڈ فائلیں"
                    : "ملفات Google Drive السحابية"}
                </h3>
                <p className="text-xs text-blue-200/90 font-medium">
                  {lang === "en"
                    ? "Folder: website file • Linked directly with buttons & verification downloads"
                    : lang === "ur"
                    ? "فولڈر: website file • بٹنوں اور تصدیق کے لیے براہ راست ڈاؤن لوڈ"
                    : "المجلد المتصل: website file • ربط مباشر بالأزرار والتحميل الفوري"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Direct Upload New File Input */}
              <input
                type="file"
                id="direct-drive-upload-input"
                className="sr-only"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onUploadDirect(e.target.files[0]);
                  }
                  e.target.value = "";
                }}
              />
              <label
                htmlFor="direct-drive-upload-input"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="رفع ملف جديد إلى Google Drive"
              >
                <span>⬆️</span>
                <span>
                  {lang === "en"
                    ? "Upload New"
                    : lang === "ur"
                    ? "نئی فائل اپلوڈ"
                    : "رفع ملف جديد"}
                </span>
              </label>

              <button
                type="button"
                onClick={onRefresh}
                disabled={loadingDriveFiles}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="تحديث قائمة الملفات"
              >
                <span className={loadingDriveFiles ? "animate-spin inline-block" : ""}>🔄</span>
                <span>{lang === "en" ? "Refresh" : lang === "ur" ? "ریفریش" : "تحديث"}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4 font-sans bg-slate-50/50">
            {loadingDriveFiles ? (
              <div className="py-14 text-center text-slate-500">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold">
                  {lang === "en"
                    ? "Fetching files from Google Drive..."
                    : lang === "ur"
                    ? "گوگل ڈرائیو سے فائلیں لائی جا رہی ہیں..."
                    : "جاري استرداد الملفات من Google Drive..."}
                </p>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 text-3xl flex items-center justify-center mx-auto shadow-inner">
                  📂
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {lang === "en"
                      ? "No files found in Google Drive folder 'website file'"
                      : lang === "ur"
                      ? "گوگل ڈرائیو فولڈر 'website file' میں کوئی فائل نہیں ملی"
                      : "لم يتم العثور على ملفات داخل مجلد website file في Google Drive"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {lang === "en"
                      ? "Click 'Upload New' to upload files directly to your Google Drive."
                      : lang === "ur"
                      ? "فائلیں براہ راست گوگل ڈرائیو پر اپلوڈ کرنے کیلئے 'نئی فائل اپلوڈ' پر کلک کریں۔"
                      : "انقر على 'رفع ملف جديد' لحفظ الملفات مباشرة في Google Drive."}
                  </p>
                </div>
                <div className="pt-2">
                  <label
                    htmlFor="direct-drive-upload-input"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all inline-flex items-center gap-2 select-none active:scale-95"
                  >
                    <span>⬆️</span>
                    <span>
                      {lang === "en"
                        ? "Upload File Now"
                        : lang === "ur"
                        ? "فائل ابھی اپلوڈ کریں"
                        : "رفع ملف جديد الآن"}
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>
                    {lang === "en"
                      ? `Found ${driveFiles.length} file(s) in Google Drive folder:`
                      : lang === "ur"
                      ? `گوگل ڈرائیو میں ${driveFiles.length} فائلیں موجود ہیں:`
                      : `تم العثور على ${driveFiles.length} ملف في Google Drive:`}
                  </span>
                  <span className="text-[11px] text-blue-600">
                    {drivePickerTarget
                      ? lang === "en"
                        ? `Target: ${drivePickerTarget}`
                        : `الهدف الحالي: ${drivePickerTarget}`
                      : lang === "en"
                      ? "Cloud File Management"
                      : "إدارة الملفات السحابية"}
                  </span>
                </div>
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-2xl shrink-0">
                        {file.mimeType.includes("pdf")
                          ? "📄"
                          : file.mimeType.includes("image")
                          ? "🖼️"
                          : "📁"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-xs font-bold text-slate-900 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>
                            {file.size ? formatFileSize(parseInt(file.size)) : "Google Drive"}
                          </span>
                          {updatingFileId === file.id && (
                            <span className="text-amber-600 font-bold animate-pulse">
                              {lang === "en" ? "Updating in Drive..." : "جاري التحديث في Drive..."}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap sm:shrink-0">
                      {/* Preview in Google Drive */}
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-slate-500 hover:text-blue-600 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                          title={
                            lang === "en"
                              ? "Preview in Google Drive"
                              : lang === "ur"
                              ? "گوگل ڈرائیو میں دیکھیں"
                              : "معاينة في Drive"
                          }
                        >
                          {lang === "en" ? "Preview ↗" : lang === "ur" ? "معائنہ ↗" : "معاينة ↗"}
                        </a>
                      )}

                      {/* UPDATE / REPLACE FILE OPTION */}
                      <input
                        type="file"
                        id={`update-drive-file-${file.id}`}
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            onUpdateFile(file, e.target.files[0]);
                          }
                          e.target.value = "";
                        }}
                      />
                      <label
                        htmlFor={`update-drive-file-${file.id}`}
                        className="px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-600 text-amber-700 hover:text-white text-xs font-bold shadow-2xs cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 select-none"
                        title={
                          lang === "en"
                            ? "Update / replace this file in Google Drive"
                            : lang === "ur"
                            ? "گوگل ڈرائیو میں فائل اپ ڈیٹ کریں"
                            : "تحديث / استبدال هذا الملف في Google Drive"
                        }
                      >
                        <span>🔄</span>
                        <span>{lang === "en" ? "Update" : lang === "ur" ? "اپ ڈیٹ" : "تحديث"}</span>
                      </label>

                      {/* TARGET SELECTION: If opened for a specific button */}
                      {drivePickerTarget ? (
                        <button
                          type="button"
                          onClick={() => onSelectForTarget(drivePickerTarget, file)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          {lang === "en"
                            ? "Select File"
                            : lang === "ur"
                            ? "منتخب کریں"
                            : "اختيار هذا الملف"}
                        </button>
                      ) : (
                        /* QUICK ASSIGN TO BUTTONS: If opened in standalone management mode */
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onAssignToButton("downloadButton", file)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-all shadow-2xs active:scale-95"
                            title="ربط بزر التحميل"
                          >
                            {lang === "en"
                              ? "To Download"
                              : lang === "ur"
                              ? "ڈاؤن لوڈ بٹن"
                              : "زر التحميل"}
                          </button>
                          <button
                            type="button"
                            onClick={() => onAssignToButton("verifyAgainButton", file)}
                            className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 text-[11px] font-bold cursor-pointer transition-all"
                            title="ربط بزر التحقق"
                          >
                            {lang === "en"
                              ? "To Verify"
                              : lang === "ur"
                              ? "ویریفائی بٹن"
                              : "زر التحقق"}
                          </button>
                          <button
                            type="button"
                            onClick={() => onAssignToButton("backButton", file)}
                            className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 text-[11px] font-bold cursor-pointer transition-all"
                            title="ربط بزر العودة"
                          >
                            {lang === "en" ? "To Back" : lang === "ur" ? "بیک بٹن" : "زر العودة"}
                          </button>
                        </div>
                      )}

                      {/* DELETE FILE PERMANENTLY FROM GOOGLE DRIVE */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestDelete(file);
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold shadow-2xs cursor-pointer transition-all flex items-center gap-1.5 group active:scale-95"
                        title={
                          lang === "en"
                            ? "Delete permanently from Google Drive"
                            : lang === "ur"
                            ? "گوگل ڈرائیو سے مستقل ڈیلیٹ کریں"
                            : "حذف نهائي من Google Drive"
                        }
                      >
                        <IconTrash className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                        <span>
                          {lang === "en" ? "Delete" : lang === "ur" ? "ڈیلیٹ" : "حذف"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-500 font-medium">
              Google Drive Cloud • {driveFiles.length}{" "}
              {lang === "en" ? "files in folder" : "ملف في مجلد website file"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition-colors"
            >
              {lang === "en" ? "Close" : lang === "ur" ? "بند کریں" : "إغلاق"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── GOOGLE DRIVE DELETE CONFIRMATION NOTIFICATION MODAL ─── */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[100005] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !deletingFileId && onCancelDelete()}
        >
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-md w-full overflow-hidden p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <IconTrash className="w-7 h-7 text-rose-600" />
            </div>
            <h3 className="text-center font-black text-slate-900 text-base sm:text-lg mb-1">
              {lang === "en"
                ? "Delete file from Google Drive?"
                : lang === "ur"
                ? "کیا آپ یہ فائل گوگل ڈرائیو سے ڈیلیٹ کرنا چاہتے ہیں؟"
                : "هل تريد حذف هذا الملف نهائياً من Google Drive؟"}
            </h3>
            <p className="text-center text-xs text-slate-500 mb-4 px-2 leading-relaxed">
              {lang === "en"
                ? "This file will be permanently deleted from your Google Drive storage. This action cannot be undone."
                : lang === "ur"
                ? "یہ فائل آپ کے منسلک گوگل ڈرائیو سے ہمیشہ کیلئے ڈیلیٹ کر دی جائے گی۔ یہ عمل واپس نہیں ہو سکتا۔"
                : "سيتم حذف هذا الملف نهائياً من مساحة Google Drive المتصلة. لا يمكن التراجع عن هذا الإجراء."}
            </p>

            {/* File info card inside notification */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center gap-3 mb-5">
              <span className="text-2xl shrink-0">
                {fileToDelete.mimeType.includes("pdf")
                  ? "📄"
                  : fileToDelete.mimeType.includes("image")
                  ? "🖼️"
                  : "📁"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate" title={fileToDelete.name}>
                  {fileToDelete.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {fileToDelete.size ? formatFileSize(parseInt(fileToDelete.size)) : "Google Drive"}
                </p>
              </div>
            </div>

            {/* Action buttons inside notification */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={Boolean(deletingFileId)}
                onClick={onCancelDelete}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 text-center"
              >
                {lang === "en" ? "Cancel" : lang === "ur" ? "منسوخ" : "إلغاء"}
              </button>
              <button
                type="button"
                disabled={Boolean(deletingFileId)}
                onClick={() => onConfirmDelete(fileToDelete)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
              >
                {deletingFileId === fileToDelete.id ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {lang === "en"
                        ? "Deleting..."
                        : lang === "ur"
                        ? "ڈیلیٹ ہو رہا ہے..."
                        : "جاري الحذف..."}
                    </span>
                  </>
                ) : (
                  <>
                    <IconTrash className="w-4 h-4" />
                    <span>
                      {lang === "en" ? "Delete File" : lang === "ur" ? "ڈیلیٹ کریں" : "حذف الملف"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
