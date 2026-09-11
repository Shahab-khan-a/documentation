const fs = require('fs');
const path = require('path');

const targetFile = path.join(process.cwd(), 'app', 'admin', 'page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

const startMarker = '{/* ═══════════════ FIREBASE RECORDS & GENERATED LINKS MODAL ═══════════════ */}';
const endMarker = '{/* ═══════════════ SLIDE-OUT NAVIGATION DRAWER (INTERACTIVE & ATTRACTIVE) ═══════════════ */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found:', { startIndex, endIndex });
  process.exit(1);
}

const replacement = `${startMarker}
      <FirebaseRecordsModal
        open={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        savedRecords={savedRecords}
        loadingRecords={loadingRecords}
        onRefresh={fetchSavedRecords}
        onDeleteRecord={handleDeleteRecord}
        onCopyRecordLink={handleCopyRecordLink}
        onLoadRecordIntoEditor={handleLoadRecordIntoEditor}
        onCreateSampleRecord={handleCreateSampleRecord}
        deletingRecordId={deletingRecordId}
        copiedRecordId={copiedRecordId}
        lang={lang}
        t={t}
      />

      `;

const newContent = content.slice(0, startIndex) + replacement + content.slice(endIndex);
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log('Successfully replaced Firebase modal in app/admin/page.tsx');
