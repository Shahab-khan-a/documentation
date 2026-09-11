export type AdminLanguage = "ar" | "en" | "ur";

export interface TranslationStrings {
  title: string;
  subtitle: string;
  badge: string;
  preview_btn: string;
  save_btn: string;
  saving_btn: string;
  saved_success: string;
  save_error: string;
  reset_btn: string;
  reset_confirm: string;
  reset_success: string;
  unsaved_changes: string;
  unsaved_banner: string;
  all_saved: string;
  undo_changes: string;
  system_active: string;
  quick_preview: string;
  shortcut_hint: string;
  
  // Tabs (clean without double emojis)
  tab_dashboard: string;
  tab_buttons: string;
  tab_document: string;
  tab_footer: string;
  tab_settings: string;
  tab_preview: string;

  // Main Dashboard & Google Drive File Manager
  dashboard_title: string;
  dashboard_desc: string;
  drive_storage_used: string;
  drive_total_files: string;
  drive_cloud_status: string;
  drive_refresh_btn: string;
  drive_upload_btn: string;
  drive_uploading: string;
  drive_search_placeholder: string;
  drive_filter_all: string;
  drive_filter_pdf: string;
  drive_filter_images: string;
  drive_filter_docs: string;
  drive_delete_btn: string;
  drive_delete_confirm_title: string;
  drive_delete_confirm_desc: string;
  drive_delete_confirm_btn: string;
  drive_delete_cancel_btn: string;
  drive_delete_success: string;
  drive_delete_error: string;
  drive_copy_link: string;
  drive_copied: string;
  drive_use_as_download: string;
  drive_file_used_success: string;
  drive_empty_state: string;
  drive_empty_state_sub: string;
  drive_view_grid: string;
  drive_view_list: string;
  drive_storage_used_label: string;
  drive_storage_free_label: string;
  drive_storage_total_label: string;
  drive_storage_breakdown: string;
  drive_storage_plan_select: string;
  drive_sort_by: string;
  drive_sort_newest: string;
  drive_sort_oldest: string;
  drive_sort_size_desc: string;
  drive_sort_size_asc: string;
  drive_sort_name_asc: string;
  drive_dropzone_title: string;
  drive_dropzone_sub: string;
  drive_storage_status_good: string;
  drive_storage_percent_used: string;
  drive_storage_percent_free: string;

  // Stats bar
  stats_document: string;
  stats_btn1: string;
  stats_btn2: string;
  stats_btn3: string;
  status_file: string;
  status_link: string;
  status_animation: string;
  status_default: string;

  // Button 1 (Back)
  btn1_title: string;
  btn1_badge: string;
  btn1_desc: string;
  btn_label: string;
  btn_action_mode: string;
  mode_link: string;
  mode_file: string;
  mode_animation: string;
  paste_url: string;
  url_placeholder: string;
  url_hint: string;
  file_upload_title: string;
  file_upload_sub: string;
  file_attached: string;
  test_preview_file: string;
  replace_file: string;
  remove_file: string;
  test_download_file: string;
  open_new_tab: string;
  show_loader: string;

  // Button 2 (Verify)
  btn2_title: string;
  btn2_badge: string;
  btn2_desc: string;

  // Button 3 (Download)
  btn3_title: string;
  btn3_badge: string;
  btn3_desc: string;
  file_download_hint: string;

  // Document Fields
  doc_title: string;
  doc_desc: string;
  serial_number: string;
  serial_number_hint: string;
  serial_number_required_error: string;
  unified_number_duplicate_error: string;
  unified_number_change_required_error: string;
  firebase_records_btn: string;
  firebase_records_title: string;
  firebase_records_desc: string;
  copy_link_btn: string;
  link_copied: string;
  open_link_btn: string;
  edit_in_editor: string;
  delete_record_btn: string;
  confirm_delete_record: string;
  record_deleted_success: string;
  no_records_found: string;
  search_records_placeholder: string;
  chamber_name: string;
  facility_name: string;
  facility_sub_name: string;
  unified_number: string;
  request_number: string;
  request_type: string;
  applicant_name: string;
  amount: string;
  creation_date: string;
  creation_time: string;
  expiry_date: string;
  expiry_time: string;
  commercial_reg_no: string;
  request_status: string;
  status_color: string;

  // Custom Fields
  custom_fields_title: string;
  custom_fields_desc: string;
  add_field_btn: string;
  field_label_placeholder: string;
  field_value_placeholder: string;
  no_custom_fields: string;
  quick_presets: string;

  // Footer & Social
  footer_title: string;
  footer_desc: string;
  support_phone: string;
  dev_label: string;
  company_ar: string;
  company_en: string;
  social_title: string;

  // Settings
  settings_title: string;
  settings_desc: string;
  portal_title: string;
  page_title: string;
  loader_initial_ms: string;
  loader_button_ms: string;
  initial_loader_toggle: string;
  seconds_hint: string;

  // Live preview
  preview_title: string;
  preview_desc: string;
  preview_back: string;
  preview_verify: string;
  preview_download: string;
}

export const ADMIN_TRANSLATIONS: Record<AdminLanguage, TranslationStrings> = {
  ar: {
    title: "لوحة تحكم وإدارة البوابة",
    subtitle: "تعديل محتوى الصفحة، روابط الأزرار، ورفع ملفات التحميل",
    badge: "لوحة الإدارة",
    preview_btn: "معاينة الصفحة الرئيسية",
    save_btn: "حفظ التعديلات",
    saving_btn: "جاري الحفظ...",
    saved_success: "تم حفظ التعديلات بنجاح وستظهر مباشرة في الصفحة الرئيسية!",
    save_error: "حدث خطأ أثناء حفظ التعديلات",
    reset_btn: "استعادة الافتراضي",
    reset_confirm: "هل أنت متأكد من استعادة كافة الإعدادات الافتراضية؟",
    reset_success: "تمت استعادة الإعدادات الافتراضية. اضغط حفظ للاعتماد.",
    unsaved_changes: "تعديلات غير محفوظة",
    unsaved_banner: "لديك تعديلات جديدة لم يتم حفظها بعد",
    all_saved: "النظام متزامن ومحفوظ",
    undo_changes: "تراجع",
    system_active: "متصل بالخادم",
    quick_preview: "معاينة سريعة",
    shortcut_hint: "Ctrl + S للحفظ الفوري",

    tab_dashboard: "الرئيسية وملفات Drive",
    tab_buttons: "الأزرار والملفات",
    tab_document: "بيانات الوثيقة",
    tab_footer: "الدعم والتواصل",
    tab_settings: "الشاشات والمؤثرات",
    tab_preview: "المعاينة الحية",

    dashboard_title: "لوحة التحكم الرئيسية وإدارة ملفات Google Drive",
    dashboard_desc: "استعراض كافة الملفات المخزنة في Google Drive، فحص الحجم، التحميل المباشر، ربطها بالبوابة أو حذفها نهائياً.",
    drive_storage_used: "المساحة المستخدمة",
    drive_total_files: "إجمالي الملفات في Drive",
    drive_cloud_status: "سحابة Google Drive متصلة",
    drive_refresh_btn: "تحديث الملفات",
    drive_upload_btn: "رفع ملف جديد إلى Drive",
    drive_uploading: "جاري رفع الملف إلى Google Drive...",
    drive_search_placeholder: "ابحث بالاسم عن أي ملف في Google Drive...",
    drive_filter_all: "كافة الملفات",
    drive_filter_pdf: "ملفات PDF",
    drive_filter_images: "الصور والوسائط",
    drive_filter_docs: "ملفات أخرى",
    drive_delete_btn: "حذف من Drive",
    drive_delete_confirm_title: "تأكيد حذف الملف من Google Drive",
    drive_delete_confirm_desc: "هل أنت متأكد من حذف هذا الملف نهائياً من Google Drive؟ لن تتمكن من التراجع عن هذه العملية بعد إتمامها.",
    drive_delete_confirm_btn: "نعم، احذف الملف نهائياً",
    drive_delete_cancel_btn: "إلغاء الأمر",
    drive_delete_success: "تم حذف الملف بنجاح من Google Drive!",
    drive_delete_error: "حدث خطأ أثناء محاولة حذف الملف من Google Drive",
    drive_copy_link: "نسخ الرابط",
    drive_copied: "تم النسخ بنجاح!",
    drive_use_as_download: "تعيين كملف زر التحميل",
    drive_file_used_success: "تم تعيين هذا الملف كملف تنزيل رسمي للبوابة بنجاح!",
    drive_empty_state: "لا توجد ملفات متطابقة في Google Drive",
    drive_empty_state_sub: "قم برفع ملف جديد أو مسح كلمة البحث لرؤية كافة ملفات السحابة.",
    drive_view_grid: "عرض شبكي",
    drive_view_list: "عرض قائمة",
    drive_storage_used_label: "المساحة المستهلكة (المغطاة)",
    drive_storage_free_label: "المساحة المتبقية الشاغرة",
    drive_storage_total_label: "إجمالي السعة التخزينية للسحابة",
    drive_storage_breakdown: "توزيع المساحة حسب النوع",
    drive_storage_plan_select: "خطة سعة التخزين",
    drive_sort_by: "ترتيب الملفات",
    drive_sort_newest: "الأحدث أولاً",
    drive_sort_oldest: "الأقدم أولاً",
    drive_sort_size_desc: "الأكبر حجماً",
    drive_sort_size_asc: "الأصغر حجماً",
    drive_sort_name_asc: "الاسم (أ - ي)",
    drive_dropzone_title: "اسحب الملفات وأفلتها هنا للرفع الفوري",
    drive_dropzone_sub: "يتم حفظ وتشفير الملفات مباشرة في مجلد Google Drive الخاص بك",
    drive_storage_status_good: "المساحة التخزينية ممتازة - تتوفر سعة كبيرة جداً",
    drive_storage_percent_used: "نسبة الاستهلاك",
    drive_storage_percent_free: "نسبة المساحة المتاحة",

    stats_document: "المنشأة الحالية",
    stats_btn1: "زر الرجوع (1)",
    stats_btn2: "زر إعادة التحقق (2)",
    stats_btn3: "زر التحميل (3)",
    status_file: "ملف مرفق",
    status_link: "رابط مخصص",
    status_animation: "فحص متكرر",
    status_default: "افتراضي",

    btn1_title: "زر «رجوع» (Back)",
    btn1_badge: "زر رقم 1 - أعلى الصفحة",
    btn1_desc: "الزر المعروض في شريط العنوان أعلى الصفحة للرجوع أو فتح رابط",
    btn_label: "نص الزر المعروض",
    btn_action_mode: "نوع عمل الزر",
    mode_link: "رابط مخصص",
    mode_file: "إرفاق ملف",
    mode_animation: "إعادة الفحص",
    paste_url: "ألصق الرابط هنا (URL)",
    url_placeholder: "https://example.com",
    url_hint: "أدخل أي رابط تريده ليتم فتحه عند ضغط الزر",
    file_upload_title: "اضغط هنا لرفع ملف (PDF، صورة، مستند)",
    file_upload_sub: "سيتم فتح أو تنزيل هذا الملف عند ضغط الزر",
    file_attached: "ملف مرفق جاهز",
    test_preview_file: "معاينة الملف ↗",
    replace_file: "استبدال الملف",
    remove_file: "حذف الملف",
    test_download_file: "تجربة التحميل الآن",
    open_new_tab: "فتح في تبويب جديد (New Tab)",
    show_loader: "عرض أنيميشن الانتظار (4 ثوانٍ) عند الضغط",

    btn2_title: "زر «إعادة التحقق» (Verify Again)",
    btn2_badge: "زر رقم 2 - أسفل البيانات",
    btn2_desc: "الزر الأيمن أسفل بطاقة البيانات للتحقق المتكرر أو فتح رابط/ملف",

    btn3_title: "زر «تحميل» (Download)",
    btn3_badge: "زر رقم 3 - زر التحميل الرئيسي",
    btn3_desc: "الزر المخصص لتحميل الشهادة أو الوثيقة الرسمية المعتمدة",
    file_download_hint: "عندما يضغط الزائر على تحميل، سيعمل أنيميشن التحميل ثم يتم تنزيل هذا الملف فوراً!",

    doc_title: "تعديل تفاصيل وبيانات الوثيقة",
    doc_desc: "يمكنك تغيير كافة معلومات المنشأة وأرقام التسجيل والتواريخ والمبالغ",
    serial_number: "الرقم التسلسلي (يظهر في رابط الصفحة مع الرقم الموحد)",
    serial_number_hint: "الرقم التسلسلي والرقم الموحد يشكلان معاً رابط الصفحة العلوي (مثال: example.com/12345/7032840279) ويبقى الرقم التسلسلي مخفياً من متن الشهادة. يلزم إدخاله لحفظ أي تعديلات.",
    serial_number_required_error: "يرجى إدخال الرقم التسلسلي في تفاصيل الوثيقة قبل حفظ التعديلات!",
    firebase_records_btn: "سجلات وروابط Firebase المحفوظة",
    firebase_records_title: "سجلات وروابط Firebase المباشرة",
    firebase_records_desc: "جميع السجلات المحفوظة في قاعدة بيانات Firebase مع الروابط المباشرة المولدة للمشاركة",
    copy_link_btn: "نسخ الرابط",
    link_copied: "تم نسخ الرابط بنجاح!",
    open_link_btn: "فتح الرابط",
    edit_in_editor: "تعديل في لوحة التحكم",
    delete_record_btn: "حذف من Firebase",
    confirm_delete_record: "هل أنت متأكد من حذف هذا السجل نهائياً من Firebase؟",
    record_deleted_success: "تم حذف السجل من Firebase بنجاح!",
    no_records_found: "لا توجد سجلات محفوظة حالياً في Firebase.",
    unified_number_duplicate_error: "الرقم الموحد مسجل مسبقاً في Firebase! يرجى استخدام رقم موحد آخر (الرقم التسلسلي يمكن تكراره بحرية).",
    unified_number_change_required_error: "يجب تغيير الرقم الموحد (700) أولاً قبل حفظ التعديلات! لا يمكن حفظ التعديلات بنفس الرقم الموحد السابق.",
    search_records_placeholder: "ابحث برقم السجل، الرقم الموحد، أو اسم المنشأة...",
    chamber_name: "اسم الغرفة",
    facility_name: "اسم المنشأة الرئيسي",
    facility_sub_name: "الاسم الفرعي للمنشأة",
    unified_number: "الرقم الموحد (700)",
    request_number: "رقم الطلب",
    request_type: "نوع الطلب",
    applicant_name: "اسم مقدم الطلب",
    amount: "مبلغ الطلب",
    creation_date: "تاريخ الإنشاء",
    creation_time: "وقت الإنشاء",
    expiry_date: "تاريخ الصلاحية",
    expiry_time: "وقت الصلاحية",
    commercial_reg_no: "رقم السجل التجاري",
    request_status: "حالة الطلب",
    status_color: "لون حالة الطلب",

    custom_fields_title: "إضافة حقول وبيانات جديدة للوثيقة",
    custom_fields_desc: "يمكنك إضافة أي خيارات أو بنود جديدة للوثيقة (مثل: المدينة، رقم الآيبان، رقم الهوية) وستظهر فوراً في الصفحة الرئيسية بالعربية",
    add_field_btn: "إضافة حقل جديد ➕",
    field_label_placeholder: "عنوان الحقل (مثال: المدينة أو رقم الآيبان)",
    field_value_placeholder: "قيمة الحقل (مثال: ينبع أو SA123456...)",
    no_custom_fields: "لم تقم بإضافة أي حقول إضافية بعد. اضغط على الزر لإضافة حقل جديد يظهر على الصفحة الرئيسية.",
    quick_presets: "اقتراحات سريعة:",

    footer_title: "معلومات التذييل والدعم الفني",
    footer_desc: "إدارة أرقام الاتصال، أسماء الشركات المطورة وروابط التواصل الاجتماعي",
    support_phone: "هاتف الدعم الفني والاستفسارات",
    dev_label: "عبارة التطوير والتشغيل",
    company_ar: "اسم الشركة (بالعربية)",
    company_en: "اسم الشركة (بالإنجليزية)",
    social_title: "روابط منصات التواصل الاجتماعي (الفوتر):",

    settings_title: "إعدادات شاشات الانتظار والمؤثرات",
    settings_desc: "التحكم في فترات الانتظار وشاشة التحميل الافتتاحية",
    portal_title: "عنوان البوابة الرئيسي",
    page_title: "عنوان الصفحة الداخلي",
    loader_initial_ms: "مدة شاشة البداية الافتتاحية (ميلي ثانية)",
    loader_button_ms: "مدة أنيميشن ضغط الأزرار (ميلي ثانية)",
    initial_loader_toggle: "تفعيل شاشة الانتظار الافتتاحية عند فتح الصفحة",
    seconds_hint: "1000 ميلي ثانية = ثانية واحدة",

    preview_title: "معاينة حية لبطاقة الوثيقة",
    preview_desc: "تظهر البيانات تماماً كما ستظهر للزوار في الصفحة الرئيسية باللغة العربية",
    preview_back: "رجوع",
    preview_verify: "إعادة التحقق",
    preview_download: "تحميل",
  },

  en: {
    title: "Portal Admin Dashboard",
    subtitle: "Manage page content, button links & file attachments seamlessly",
    badge: "Admin Control",
    preview_btn: "View Main Page",
    save_btn: "Save Changes",
    saving_btn: "Saving...",
    saved_success: "Changes saved successfully! Reflected live on the main Arabic page.",
    save_error: "An error occurred while saving changes",
    reset_btn: "Reset Defaults",
    reset_confirm: "Are you sure you want to restore default configuration?",
    reset_success: "Default configuration restored. Click Save to apply.",
    unsaved_changes: "Unsaved edits",
    unsaved_banner: "You have unsaved changes waiting to be applied",
    all_saved: "System Synced & Saved",
    undo_changes: "Discard",
    system_active: "Connected",
    quick_preview: "Quick Preview",
    shortcut_hint: "Ctrl + S to save",

    tab_dashboard: "Dashboard & Drive Files",
    tab_buttons: "Buttons & Files",
    tab_document: "Document Details",
    tab_footer: "Support & Social",
    tab_settings: "Display & Timers",
    tab_preview: "Live Preview",

    dashboard_title: "Main Dashboard & Google Drive Cloud Storage",
    dashboard_desc: "Manage all Google Drive files, inspect storage sizes, preview, download, assign to portal buttons, or permanently delete files.",
    drive_storage_used: "Storage Consumed",
    drive_total_files: "Total Cloud Files",
    drive_cloud_status: "Connected to Google Drive Cloud",
    drive_refresh_btn: "Refresh Files",
    drive_upload_btn: "Upload to Drive",
    drive_uploading: "Uploading file to Google Drive...",
    drive_search_placeholder: "Search Google Drive files by name...",
    drive_filter_all: "All Files",
    drive_filter_pdf: "PDF Documents",
    drive_filter_images: "Images & Media",
    drive_filter_docs: "Other Documents",
    drive_delete_btn: "Delete from Drive",
    drive_delete_confirm_title: "Confirm Delete from Google Drive",
    drive_delete_confirm_desc: "Are you sure you want to permanently delete this file from Google Drive? This action cannot be undone.",
    drive_delete_confirm_btn: "Yes, Delete File",
    drive_delete_cancel_btn: "Cancel",
    drive_delete_success: "File successfully deleted from Google Drive!",
    drive_delete_error: "Failed to delete file from Google Drive",
    drive_copy_link: "Copy Link",
    drive_copied: "Copied!",
    drive_use_as_download: "Set as Download Button File",
    drive_file_used_success: "File assigned to portal download button successfully!",
    drive_empty_state: "No matching files found in Google Drive",
    drive_empty_state_sub: "Upload a new file or clear search filters to view cloud items.",
    drive_view_grid: "Grid View",
    drive_view_list: "List View",
    drive_storage_used_label: "Storage Covered / Used",
    drive_storage_free_label: "Available / Free Storage",
    drive_storage_total_label: "Total Cloud Quota",
    drive_storage_breakdown: "Storage Breakdown",
    drive_storage_plan_select: "Storage Quota Plan",
    drive_sort_by: "Sort Files",
    drive_sort_newest: "Newest First",
    drive_sort_oldest: "Oldest First",
    drive_sort_size_desc: "Largest Size",
    drive_sort_size_asc: "Smallest Size",
    drive_sort_name_asc: "Name (A - Z)",
    drive_dropzone_title: "Drag & Drop files here or click to browse",
    drive_dropzone_sub: "Files are saved and encrypted directly into your Google Drive folder",
    drive_storage_status_good: "Storage Status: Optimal - Plenty of free space available",
    drive_storage_percent_used: "Quota Used",
    drive_storage_percent_free: "Free Remaining",

    stats_document: "Active Facility",
    stats_btn1: "Back Button (1)",
    stats_btn2: "Verify Button (2)",
    stats_btn3: "Download Button (3)",
    status_file: "File Attached",
    status_link: "Custom URL",
    status_animation: "Re-run Verification",
    status_default: "Default",

    btn1_title: "«Back» Button (رجوع)",
    btn1_badge: "Button #1 - Top Bar",
    btn1_desc: "Displayed in the top title bar to go back or navigate to a custom URL/file",
    btn_label: "Button Label Text",
    btn_action_mode: "Action Mode",
    mode_link: "Custom URL",
    mode_file: "Attach File",
    mode_animation: "Re-verify Animation",
    paste_url: "Paste URL Link",
    url_placeholder: "https://example.com",
    url_hint: "Enter any link to open when this button is clicked",
    file_upload_title: "Click to upload file (PDF, image, doc)",
    file_upload_sub: "This file will open or download when clicked",
    file_attached: "File attached & ready",
    test_preview_file: "Preview File ↗",
    replace_file: "Replace File",
    remove_file: "Remove File",
    test_download_file: "Test Download Now",
    open_new_tab: "Open in new tab",
    show_loader: "Show 4-second loading animation before action",

    btn2_title: "«Verify Again» Button (إعادة التحقق)",
    btn2_badge: "Button #2 - Action Area",
    btn2_desc: "Right button below document card for re-verification, custom link, or file",

    btn3_title: "«Download» Button (تحميل)",
    btn3_badge: "Button #3 - Certificate Download",
    btn3_desc: "Primary button to download certificate/document or open download link",
    file_download_hint: "When visitors click Download, the 4-second loader will run, then this file will instantly download!",

    doc_title: "Edit Document & Certificate Data",
    doc_desc: "All values are displayed in Arabic on the main portal for visitors",
    serial_number: "Serial Number (Appears in URL with Unified Number)",
    serial_number_hint: "The serial number and unified number together form the public page URL (e.g. example.com/12345/7032840279). Serial number remains hidden from the certificate card body. Required to save changes.",
    serial_number_required_error: "Please enter the Serial Number in Document Details before saving changes!",
    firebase_records_btn: "Firebase Saved Records & Links",
    firebase_records_title: "Firebase Live Records & Shareable Links",
    firebase_records_desc: "All saved portal certificates in Firebase Firestore with direct shareable links",
    copy_link_btn: "Copy Link",
    link_copied: "Link copied to clipboard!",
    open_link_btn: "Open Link",
    edit_in_editor: "Edit in Admin",
    delete_record_btn: "Delete from Firebase",
    confirm_delete_record: "Are you sure you want to permanently delete this record from Firebase?",
    record_deleted_success: "Record deleted from Firebase successfully!",
    no_records_found: "No saved records found in Firebase yet.",
    unified_number_duplicate_error: "This Unified Number already exists in Firebase! Please use a different unified number (Serial number can be reused freely).",
    unified_number_change_required_error: "You must change the Unified Number (700) before saving changes! It cannot remain the same as the previous one.",
    search_records_placeholder: "Search by serial number, unified number, or facility...",
    chamber_name: "Chamber Name (اسم الغرفة)",
    facility_name: "Facility Main Name (اسم المنشأة)",
    facility_sub_name: "Facility Sub-Name (الاسم الفرعي)",
    unified_number: "Unified Number 700 (الرقم الموحد)",
    request_number: "Request Number (رقم الطلب)",
    request_type: "Request Type (نوع الطلب)",
    applicant_name: "Applicant Name (اسم مقدم الطلب)",
    amount: "Amount (مبلغ الطلب)",
    creation_date: "Creation Date (تاريخ الإنشاء)",
    creation_time: "Creation Time (وقت الإنشاء)",
    expiry_date: "Expiry Date (تاريخ الصلاحية)",
    expiry_time: "Expiry Time (وقت الصلاحية)",
    commercial_reg_no: "Commercial Reg No (السجل التجاري)",
    request_status: "Request Status (حالة الطلب)",
    status_color: "Status Color",

    custom_fields_title: "Add New Custom Document Fields",
    custom_fields_desc: "Add any new custom rows or options to the document (e.g. City, IBAN, National ID). They will show up in Arabic on the main page.",
    add_field_btn: "Add New Field ➕",
    field_label_placeholder: "Field Title (e.g. City or IBAN)",
    field_value_placeholder: "Field Value (e.g. Yanbu or SA123456...)",
    no_custom_fields: "No custom fields added yet. Click the button to add a new custom field.",
    quick_presets: "Quick Suggestions:",

    footer_title: "Footer & Support Information",
    footer_desc: "Manage support hotline, operating company titles, and social media handles",
    support_phone: "Support Helpline Phone Number",
    dev_label: "Operation & Development Label",
    company_ar: "Company Name (Arabic)",
    company_en: "Company Name (English)",
    social_title: "Social Media Platform Links (Footer):",

    settings_title: "Screens, Timers & Animations",
    settings_desc: "Configure the entrance GIF duration and button animation length",
    portal_title: "Portal Header Title",
    page_title: "Page Section Title",
    loader_initial_ms: "Initial Entrance Screen Duration (milliseconds)",
    loader_button_ms: "Button Animation Duration (milliseconds)",
    initial_loader_toggle: "Enable full-screen entrance GIF loader when page loads",
    seconds_hint: "1000 ms = 1 second",

    preview_title: "Live Preview of Document Card",
    preview_desc: "Shows exactly how visitors see the verification card in Arabic",
    preview_back: "Back",
    preview_verify: "Verify Again",
    preview_download: "Download",
  },

  ur: {
    title: "پورٹل ایڈمن کنٹرول پینل",
    subtitle: "صفحہ کا مواد، بٹن لنکس اور ڈاؤن لوڈ فائلیں باآسانی تبدیل کریں",
    badge: "ایڈمن پینل",
    preview_btn: "مین پیج دیکھیں",
    save_btn: "تبدیلیاں محفوظ کریں",
    saving_btn: "محفوظ ہو رہا ہے...",
    saved_success: "تمام تبدیلیاں کامیابی سے محفوظ ہو گئیں اور مین پیج پر نظر آ رہی ہیں!",
    save_error: "تبدیلیاں محفوظ کرتے وقت خرابی پیش آگئی",
    reset_btn: "ڈیفالٹ سیٹ کریں",
    reset_confirm: "کیا آپ واقعی تمام ڈیفالٹ ترتیبات بحال کرنا چاہتے ہیں؟",
    reset_success: "ڈیفالٹ ترتیبات بحال ہو گئیں۔ لاگو کرنے کیلئے 'محفوظ کریں' دبائیں۔",
    unsaved_changes: "غیر محفوظ تبدیلیاں",
    unsaved_banner: "آپ نے تبدیلیاں کی ہیں جو ابھی محفوظ ہونا باقی ہیں",
    all_saved: "سسٹم ہم آہنگ اور محفوظ ہے",
    undo_changes: "واپس لیں",
    system_active: "آن لائن رابطہ",
    quick_preview: "فوری پریویو",
    shortcut_hint: "فوری محفوظ کرنے کیلئے Ctrl + S",

    tab_dashboard: "مین ڈیش بورڈ اور ڈرائیو فائلز",
    tab_buttons: "بٹنز اور فائلیں",
    tab_document: "دستاویز کی تفصیلات",
    tab_footer: "سپورٹ اور سوشل",
    tab_settings: "ڈسپلے اور ٹائمرز",
    tab_preview: "لائیو پریویو",

    dashboard_title: "مرکزی ڈیش بورڈ اور گوگل ڈرائیو فائل منیجر",
    dashboard_desc: "گوگل ڈرائیو کی تمام فائلز دیکھیں، سائز چیک کریں، لائیو پریویو دیکھیں، لنک کاپی کریں، پورٹل پر سیٹ کریں یا ڈرائیو سے ہمیشہ کیلئے ڈیلیٹ کریں۔",
    drive_storage_used: "استعمال شدہ اسپیس",
    drive_total_files: "ڈرائیو میں کل فائلز",
    drive_cloud_status: "گوگل ڈرائیو کلاؤڈ منسلک ہے",
    drive_refresh_btn: "فائلز ریفریش کریں",
    drive_upload_btn: "ڈرائیو پر نئی فائل اپلوڈ کریں",
    drive_uploading: "گوگل ڈرائیو پر فائل اپلوڈ ہو رہی ہے...",
    drive_search_placeholder: "گوگل ڈرائیو کی کسی بھی فائل کا نام تلاش کریں...",
    drive_filter_all: "تمام فائلیں",
    drive_filter_pdf: "پی ڈی ایف فائلیں",
    drive_filter_images: "تصاویر اور میڈیا",
    drive_filter_docs: "دیگر فائلیں",
    drive_delete_btn: "ڈرائیو سے ڈیلیٹ کریں",
    drive_delete_confirm_title: "گوگل ڈرائیو سے فائل ڈیلیٹ کرنے کی تصدیق",
    drive_delete_confirm_desc: "کیا آپ واقعی یہ فائل گوگل ڈرائیو سے ہمیشہ کیلئے ڈیلیٹ کرنا چاہتے ہیں؟ ڈیلیٹ کرنے کے بعد اسے واپس نہیں لایا جا سکے گا۔",
    drive_delete_confirm_btn: "ہاں، فائل ڈیلیٹ کریں",
    drive_delete_cancel_btn: "کینسل کریں",
    drive_delete_success: "فائل گوگل ڈرائیو سے کامیابی سے ڈیلیٹ ہو گئی!",
    drive_delete_error: "گوگل ڈرائیو سے فائل ڈیلیٹ کرنے میں خرابی پیش آئی",
    drive_copy_link: "لنک کاپی کریں",
    drive_copied: "کاپی ہو گیا!",
    drive_use_as_download: "ڈاؤن لوڈ بٹن پر سیٹ کریں",
    drive_file_used_success: "یہ فائل پورٹل کے ڈاؤن لوڈ بٹن کے ساتھ منسلک ہو گئی ہے!",
    drive_empty_state: "گوگل ڈرائیو میں کوئی فائل نہیں ملی",
    drive_empty_state_sub: "نئی فائل اپلوڈ کریں یا سرچ فیلڈ خالی کریں تاکہ تمام کلاؤڈ فائلز دکھائی دیں۔",
    drive_view_grid: "گرڈ ویو",
    drive_view_list: "لسٹ ویو",
    drive_storage_used_label: "استعمال شدہ اسٹوریج (کور ہوا)",
    drive_storage_free_label: "باقی ماندہ گنجائش (اسٹوریج باقی ہے)",
    drive_storage_total_label: "کل کلاؤڈ اسٹوریج گنجائش",
    drive_storage_breakdown: "اسٹوریج کی تفصیل بلحاظ فائل",
    drive_storage_plan_select: "اسٹوریج پلان تبدیل کریں",
    drive_sort_by: "فائلز کی ترتیب",
    drive_sort_newest: "تازہ ترین پہلے",
    drive_sort_oldest: "پرانی پہلے",
    drive_sort_size_desc: "سب سے بڑی پہلے",
    drive_sort_size_asc: "سب سے چھوٹی پہلے",
    drive_sort_name_asc: "نام (الف تا ے)",
    drive_dropzone_title: "یہاں فائل ڈریگ اینڈ ڈراپ کریں یا براؤز کریں",
    drive_dropzone_sub: "فائلیں فوراً آپ کے گوگل ڈرائیو کلاؤڈ میں محفوظ ہو جائیں گی",
    drive_storage_status_good: "اسٹوریج حالت: بہترین - کافی گنجائش دستیاب ہے",
    drive_storage_percent_used: "استعمال فیصد",
    drive_storage_percent_free: "باقی فیصد",

    stats_document: "موجودہ ادارہ",
    stats_btn1: "واپسی بٹن (1)",
    stats_btn2: "تصدیق بٹن (2)",
    stats_btn3: "ڈاؤن لوڈ بٹن (3)",
    status_file: "فائل منسلک ہے",
    status_link: "کسٹم لنک",
    status_animation: "دوبارہ جانچ",
    status_default: "ڈیفالٹ",

    btn1_title: "«رجوع / Back» بٹن",
    btn1_badge: "بٹن نمبر 1 - اوپری بار",
    btn1_desc: "اوپر ٹائٹل بار میں موجود بٹن جس پر کسٹم لنک یا فائل رکھی جا سکتی ہے",
    btn_label: "بٹن پر لکھا جانے والا نام",
    btn_action_mode: "بٹن کا کام",
    mode_link: "کسٹم لنک",
    mode_file: "فائل منسلک کریں",
    mode_animation: "دوبارہ چیک اینیمیشن",
    paste_url: "یہاں لنک پیسٹ کریں (URL)",
    url_placeholder: "https://example.com",
    url_hint: "کوئی بھی لنک درج کریں جو اس بٹن پر کلک کرنے پر کھلے",
    file_upload_title: "فائل اپلوڈ کرنے کیلئے یہاں کلک کریں (PDF، تصویر یا دستاویز)",
    file_upload_sub: "کلک کرنے پر یہ فائل کھلے گی یا ڈاؤن لوڈ ہو جائے گی",
    file_attached: "فائل منسلک ہوچکی ہے",
    test_preview_file: "فائل دیکھیں ↗",
    replace_file: "فائل تبدیل کریں",
    remove_file: "فائل ہٹائیں",
    test_download_file: "فائل ڈاؤن لوڈ ٹیسٹ کریں",
    open_new_tab: "نئے ٹیب میں کھولیں",
    show_loader: "کلک کرنے پر 4 سیکنڈ کی اینیمیشن دکھائیں",

    btn2_title: "«إعادة التحقق / دوبارہ تصدیق» بٹن",
    btn2_badge: "بٹن نمبر 2 - دائیں طرف",
    btn2_desc: "کارڈ کے نیچے موجود دائیں بٹن سے لنک کھولیں یا دوبارہ چیک کریں",

    btn3_title: "«تحميل / ڈاؤن لوڈ» بٹن",
    btn3_badge: "بٹن نمبر 3 - سرٹیفکیٹ ڈاؤن لوڈ",
    btn3_desc: "اصلی دستاویز یا سرٹیفکیٹ ڈاؤن لوڈ کروانے کا اہم بٹن",
    file_download_hint: "جب بھی وزٹر ڈاؤن لوڈ دبائے گا، 4 سیکنڈ کا لوڈر چلے گا اور یہ فائل فوراً ڈاؤن لوڈ ہو جائے گی!",

    doc_title: "دستاویز اور سرٹیفکیٹ کی تفصیلات",
    doc_desc: "یہ تمام تفصیلات مین پیج پر عربی زبان میں وزٹرز کو دکھائی دیں گی",
    serial_number: "سیریل نمبر (قومی نمبر کے ساتھ لنک میں شامل ہوگا)",
    serial_number_hint: "سیریل نمبر اور 700 کا قومی نمبر دونوں مل کر مین پیج کا مکمل لنک بناتے ہیں (مثال: example.com/12345/7032840279)۔ سیریل نمبر دستاویز کی تحریر میں نظر نہیں آئے گا۔ تبدیلیاں محفوظ کرنے کیلئے یہ درج کرنا لازمی ہے۔",
    serial_number_required_error: "تبدیلیاں محفوظ کرنے سے پہلے دستاویز کی تفصیلات میں سیریل نمبر درج کریں!",
    firebase_records_btn: "فائر بیس محفوظ شدہ لنکس اور ریکارڈز",
    firebase_records_title: "فائر بیس کلاؤڈ ریکارڈز اور شیئر لنکس",
    firebase_records_desc: "فائر بیس میں محفوظ شدہ تمام دستاویزات اور ان کے مخصوص شیئر لنکس",
    copy_link_btn: "لنک کاپی کریں",
    link_copied: "لنک کاپی ہو گیا!",
    open_link_btn: "صفحہ کھولیں",
    edit_in_editor: "ایڈمن میں تبدیل کریں",
    delete_record_btn: "فائر بیس سے ڈیلیٹ کریں",
    confirm_delete_record: "کیا آپ واقعی یہ ریکارڈ فائر بیس سے ہمیشہ کے لیے ڈیلیٹ کرنا چاہتے ہیں؟",
    record_deleted_success: "ریکارڈ فائر بیس سے کامیابی سے ڈیلیٹ ہو گیا!",
    no_records_found: "فائر بیس میں کوئی محفوظ شدہ ریکارڈ موجود نہیں ہے۔",
    unified_number_duplicate_error: "یہ یونیفائیڈ نمبر پہلے سے Firebase میں محفوظ ہے! براہ کرم دوسرا یونیفائیڈ نمبر درج کریں (سیریل نمبر دوبارہ استعمال کیا جا سکتا ہے)۔",
    unified_number_change_required_error: "تبدیلیاں محفوظ کرنے سے پہلے یونیفائیڈ نمبر (700) کو تبدیل کرنا لازمی ہے! پچھلے یونیفائیڈ نمبر کے ساتھ محفوظ نہیں کیا جا سکتا۔",
    search_records_placeholder: "سیریل نمبر، قومی نمبر یا ادارے کے نام سے تلاش کریں...",
    chamber_name: "چیمبر کا نام (اسم الغرفة)",
    facility_name: "ادارے کا نام (اسم المنشأة)",
    facility_sub_name: "ادارے کا ذیلی نام (الاسم الفرعي)",
    unified_number: "700 کا قومی نمبر (الرقم الموحد)",
    request_number: "درخواست نمبر (رقم الطلب)",
    request_type: "درخواست کی قسم (نوع الطلب)",
    applicant_name: "درخواست گزار کا نام (اسم مقدم الطلب)",
    amount: "فیس کی رقم (مبلغ الطلب)",
    creation_date: "تیاری کی تاریخ (تاريخ الإنشاء)",
    creation_time: "تیاری کا وقت (وقت الإنشاء)",
    expiry_date: "میعاد ختم ہونے کی تاریخ (تاريخ الصلاحية)",
    expiry_time: "میعاد ختم ہونے کا وقت (وقت الصلاحية)",
    commercial_reg_no: "کمرشل رجسٹریشن نمبر (السجل التجاري)",
    request_status: "درخواست کی حالت (حالة الطلب)",
    status_color: "حالت کا رنگ",

    custom_fields_title: "دستاویز میں نیا فیلڈ یا آپشن شامل کریں",
    custom_fields_desc: "دستاویز میں کوئی بھی نئی لائن یا تفصیل شامل کریں (مثلاً شہر، شناختی نمبر، بینک اکاؤنٹ)۔ یہ مین پیج پر عربی میں ظاہر ہوگی۔",
    add_field_btn: "نیا فیلڈ شامل کریں ➕",
    field_label_placeholder: "فیلڈ کا عنوان (مثال: المدينة یا رقم الهوية)",
    field_value_placeholder: "فیلڈ کی تفصیل (مثال: ينبع یا 1029384...)",
    no_custom_fields: "ابھی تک کوئی نیا فیلڈ شامل نہیں کیا گیا۔ نیچے دیا گیا بٹن دبا کر نیا فیلڈ شامل کریں۔",
    quick_presets: "فوری تجاویز:",

    footer_title: "فوٹر، سپورٹ اور سوشل لنکس",
    footer_desc: "سپورٹ فون نمبر، کمپنی کا نام اور سوشل میڈیا لنکس تبدیل کریں",
    support_phone: "سپورٹ ہیلپ لائن فون نمبر",
    dev_label: "آپریشن و ڈیولپمنٹ کا عنوان",
    company_ar: "کمپنی کا نام (عربی)",
    company_en: "کمپنی کا نام (انگریزی)",
    social_title: "سوشل میڈیا پلیٹ فارم لنکس (فوٹر):",

    settings_title: "لوڈر اسکرین اور ٹائمر سیٹنگز",
    settings_desc: "شروع کی لوڈر اسکرین اور بٹنز کے ٹائمرز کی مدت تبدیل کریں",
    portal_title: "پورٹل کا مین ہیڈر ٹائٹل",
    page_title: "صفحہ کا اندرونی عنوان",
    loader_initial_ms: "شروع کی اینیمیشن اسکرین کا دورانیہ (ملی سیکنڈ)",
    loader_button_ms: "بٹن اینیمیشن کا دورانیہ (ملی سیکنڈ)",
    initial_loader_toggle: "پیج کھلتے وقت شروع کی فل اسکرین اینیمیشن چلائیں",
    seconds_hint: "1000 ملی سیکنڈ = 1 سیکنڈ",

    preview_title: "دستاویز کا لائیو پریویو",
    preview_desc: "دیکھیں کہ مین پیج پر وزٹرز کو عربی میں کارڈ کیسا نظر آئے گا",
    preview_back: "رجوع",
    preview_verify: "إعادة التحقق",
    preview_download: "تحميل",
  },
};
