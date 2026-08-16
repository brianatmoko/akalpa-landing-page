// ============================================================
// AKALPA INOVASI — TEMPLATE BACKEND (Google Apps Script)
// ============================================================
// Deploy: Extensions > Apps Script > Deploy > New Deployment
//   Type       : Web App
//   Execute As : Me
//   Access     : Anyone
// ============================================================
// PASSWORD CURATOR disimpan di Sheet "Config" (bukan di sini)
// Cara set: buka Spreadsheet > Tab "Config" > baris 2 kolom A=CURATOR_PASS, kolom B=nilai
// ============================================================

var CONFIG = {
  SHEET_NAME: "Templates",
  CONFIG_SHEET: "Config",
  COLUMNS: ["id","code","name","category","description","github","tags","featured"]
};

// ──────────────────────────────────────────────────────────────
// SETUP OTOMATIS: Jalankan sekali dari GAS Editor (Run > setupSheet)
// ──────────────────────────────────────────────────────────────
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Setup sheet Templates
  if (!ss.getSheetByName(CONFIG.SHEET_NAME)) {
    var sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(CONFIG.COLUMNS);
    sheet.getRange(1, 1, 1, CONFIG.COLUMNS.length)
      .setFontWeight("bold")
      .setBackground("#22305c")
      .setFontColor("#f7f3ea");
    sheet.setFrozenRows(1);
    Logger.log("Sheet Templates dibuat.");
  }

  // Setup sheet Config untuk menyimpan password
  if (!ss.getSheetByName(CONFIG.CONFIG_SHEET)) {
    var cfgSheet = ss.insertSheet(CONFIG.CONFIG_SHEET);
    cfgSheet.appendRow(["Key", "Value"]);
    cfgSheet.appendRow(["CURATOR_PASS", "akalpaadminweb"]);
    cfgSheet.getRange(1, 1, 1, 2)
      .setFontWeight("bold")
      .setBackground("#182442")
      .setFontColor("#f7f3ea");
    cfgSheet.setFrozenRows(1);
    Logger.log("Sheet Config dibuat dengan password default.");
  } else {
    Logger.log("Sheet Config sudah ada.");
  }
}

// ──────────────────────────────────────────────────────────────
// Ambil nilai config dari Sheet Config
// ──────────────────────────────────────────────────────────────
function getConfig(key) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cfgSheet = ss.getSheetByName(CONFIG.CONFIG_SHEET);
  if (!cfgSheet) return null;
  var rows = cfgSheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === key) return String(rows[i][1]).trim();
  }
  return null;
}

// ──────────────────────────────────────────────────────────────
// doGet — Endpoint publik: ambil semua template (JSON)
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
// doPost — Endpoint: auth + CRUD curator
// Body JSON: { action, ... }
//   action: "auth"   → { password }            → cek password dari Config sheet
//   action: "add"    → { token, data }          → tambah template
//   action: "update" → { token, data }          → update template
//   action: "delete" → { token, id }            → hapus template
//   action: "clear"  → { token }                → kosongkan semua
//   action: "bulk"   → { token, templates[] }   → bulk import
// ──────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    // Parse body JSON — bekerja dengan atau tanpa Content-Type header
    var rawBody = (e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var body = JSON.parse(rawBody);
    var action = body.action;

    // ─── AUTH ENDPOINT ───
    if (action === "auth") {
      var storedPass = getConfig("CURATOR_PASS");
      if (!storedPass) {
        return jsonOut({ ok: false, error: "Config belum disetup. Jalankan setupSheet() dulu." });
      }
      if (!body.password || body.password !== storedPass) {
        // Delay 1 detik untuk anti brute-force
        Utilities.sleep(1000);
        return jsonOut({ ok: false, error: "Password salah" });
      }
      // Password benar — kirim session token acak
      var sessionToken = generateToken();
      // Simpan token sementara di PropertiesService (max 6 jam)
      PropertiesService.getScriptProperties().setProperty("CURATOR_SESSION_" + sessionToken, String(Date.now()));
      return jsonOut({ ok: true, token: sessionToken });
    }

    // ─── CRUD ENDPOINTS — verifikasi session token ───
    if (!body.token || !isValidToken(body.token)) {
      return jsonOut({ ok: false, error: "Unauthorized — token tidak valid atau kadaluarsa" });
    }

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
// HELPER: Generate & Validate Session Token
// ──────────────────────────────────────────────────────────────
function generateToken() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var token = "";
  for (var i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function isValidToken(token) {
  if (!token) return false;
  var props = PropertiesService.getScriptProperties();
  var key = "CURATOR_SESSION_" + token;
  var ts = props.getProperty(key);
  if (!ts) return false;
  // Token expired setelah 6 jam
  var AGE_LIMIT_MS = 6 * 60 * 60 * 1000;
  if (Date.now() - parseInt(ts, 10) > AGE_LIMIT_MS) {
    props.deleteProperty(key);
    return false;
  }
  // Perpanjang sesi (rolling expiry)
  props.setProperty(key, String(Date.now()));
  return true;
}

// ──────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ──────────────────────────────────────────────────────────────

function jsonOut(obj) {
  var output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
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
  if (rows.length <= 1) return [];
  var headers = rows[0];
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
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
    if (String(rows[i][0]) === String(id)) return i + 1;
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
  sheet.getRange(rowNum, 1, 1, CONFIG.COLUMNS.length).setValues([templateToRow(data)]);
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
    Utilities.sleep(50);
  });
}
