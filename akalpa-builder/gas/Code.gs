// ============================================================
// AKALPA INOVASI — TEMPLATE BACKEND (Google Apps Script)
// ============================================================
// Deploy: Extensions > Apps Script > Deploy > New Deployment
//   Type       : Web App
//   Execute As : Me
//   Access     : Anyone
// ============================================================

// ───── KONFIGURASI — WAJIB DIISI SEBELUM DEPLOY ─────────────
var CONFIG = {
  // Isi dengan secret token bebas (minimal 32 karakter)
  // Token ini SAMA dengan yang dimasukkan di Studio Curator
  CURATOR_TOKEN: "GANTI_DENGAN_TOKEN_RAHASIA_ANDA_MIN32CHAR",

  // Nama sheet dalam Spreadsheet (biarkan default "Templates")
  SHEET_NAME: "Templates",

  // Nama kolom (urutan harus sama dengan setupSheet)
  COLUMNS: ["id","code","name","category","description","github","tags","featured"]
};

// ──────────────────────────────────────────────────────────────
// SETUP OTOMATIS: Jalankan fungsi ini SEKALI SAJA dari GAS Editor
// Menu: Run > setupSheet  (buat Sheet + header kolom)
// ──────────────────────────────────────────────────────────────
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var existing = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (existing) {
    Logger.log("Sheet '" + CONFIG.SHEET_NAME + "' sudah ada.");
    return;
  }
  var sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  sheet.appendRow(CONFIG.COLUMNS);
  sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length)
    .setFontWeight("bold")
    .setBackground("#22305c")
    .setFontColor("#f7f3ea");
  sheet.setFrozenRows(1);
  Logger.log("Sheet berhasil dibuat: " + CONFIG.SHEET_NAME);
}

// ──────────────────────────────────────────────────────────────
// doGet — Endpoint publik: ambil semua template (JSON)
// Dipanggil oleh templates.html (Blogger) dan publik
// ──────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var templates = getAllTemplates();
    var out = JSON.stringify({ ok: true, templates: templates });
    return ContentService
      .createTextOutput(out)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ──────────────────────────────────────────────────────────────
// doPost — Endpoint private: CRUD (tambah / update / hapus / clear)
// Dipanggil oleh Studio Curator dengan header X-Curator-Token
// Body JSON: { action, token, data? }
// ──────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    // Auth check
    if (!body.token || body.token !== CONFIG.CURATOR_TOKEN) {
      return jsonOut({ ok: false, error: "Unauthorized" }, 401);
    }
    var action = body.action;
    if (action === "add") {
      addTemplate(body.data);
      return jsonOut({ ok: true, action: "add" });
    } else if (action === "update") {
      updateTemplate(body.data);
      return jsonOut({ ok: true, action: "update" });
    } else if (action === "delete") {
      deleteTemplate(body.id);
      return jsonOut({ ok: true, action: "delete" });
    } else if (action === "clear") {
      clearAllTemplates();
      return jsonOut({ ok: true, action: "clear" });
    } else if (action === "bulk") {
      bulkImport(body.templates);
      return jsonOut({ ok: true, action: "bulk", count: (body.templates||[]).length });
    }
    return jsonOut({ ok: false, error: "Unknown action: " + action });
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

// ──────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ──────────────────────────────────────────────────────────────

function jsonOut(obj, status) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    setupSheet();
    sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  }
  return sheet;
}

function getAllTemplates() {
  var sheet = getSheet();
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return []; // hanya header
  var headers = rows[0];
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    // Parse tags dari string CSV
    if (typeof obj.tags === "string") {
      obj.tags = obj.tags ? obj.tags.split(",").map(function(x){ return x.trim(); }) : [];
    }
    obj.featured = (obj.featured === true || obj.featured === "TRUE" || obj.featured === 1);
    return obj;
  });
}

function findRowById(sheet, id) {
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) return i + 1; // 1-indexed sheet row
  }
  return -1;
}

function templateToRow(t) {
  return [
    String(t.id || ""),
    String(t.code || ""),
    String(t.name || ""),
    String(t.category || ""),
    String(t.description || ""),
    String(t.github || ""),
    Array.isArray(t.tags) ? t.tags.join(",") : String(t.tags || ""),
    t.featured === true || t.featured === "true" || t.featured === 1 ? true : false
  ];
}

function addTemplate(data) {
  var sheet = getSheet();
  if (!data.id) data.id = "aka-" + new Date().getTime().toString().slice(-8);
  sheet.appendRow(templateToRow(data));
}

function updateTemplate(data) {
  var sheet = getSheet();
  var rowNum = findRowById(sheet, data.id);
  if (rowNum < 0) throw new Error("Template id=" + data.id + " tidak ditemukan");
  var cols = CONFIG.COLUMNS.length;
  sheet.getRange(rowNum, 1, 1, cols).setValues([templateToRow(data)]);
}

function deleteTemplate(id) {
  var sheet = getSheet();
  var rowNum = findRowById(sheet, id);
  if (rowNum < 0) throw new Error("Template id=" + id + " tidak ditemukan");
  sheet.deleteRow(rowNum);
}

function clearAllTemplates() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
}

function bulkImport(templates) {
  clearAllTemplates();
  var sheet = getSheet();
  templates.forEach(function(t) {
    if (!t.id) t.id = "aka-" + new Date().getTime().toString().slice(-8);
    sheet.appendRow(templateToRow(t));
    Utilities.sleep(50); // hindari rate limit
  });
}
