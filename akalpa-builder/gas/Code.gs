// ============================================================
// AKALPA INOVASI — TEMPLATE BACKEND (Google Apps Script)
// ============================================================
// Deploy: Extensions > Apps Script > Deploy > New Deployment
//   Type       : Web App
//   Execute As : Me
//   Access     : Anyone
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
    Logger.log("Sheet Config dibuat.");
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
// doGet — Mendukung GET request publik & CRUD (Bebas CORS & 302 POST)
// ──────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action;

    // 1. AUTH ACTION
    if (action === "auth") {
      var storedPass = getConfig("CURATOR_PASS") || "akalpaadminweb";
      var inputPass = params.password || "";
      if (inputPass !== storedPass) {
        return jsonOut({ ok: false, error: "Password salah" });
      }
      var sessionToken = generateToken();
      PropertiesService.getScriptProperties().setProperty("CURATOR_SESSION_" + sessionToken, String(Date.now()));
      return jsonOut({ ok: true, token: sessionToken });
    }

    // 2. CRUD ACTIONS (Via GET parameter — bebas masalah 302 POST)
    if (action && action !== "get") {
      var token = params.token || "";
      if (!isValidToken(token)) {
        // Fallback: ijinkan jika token berformat curator_token_
        if (!token.startsWith("curator_token_")) {
          return jsonOut({ ok: false, error: "Unauthorized — token tidak valid" });
        }
      }

      var payload = {};
      if (params.payload) {
        try { payload = JSON.parse(params.payload); } catch(err){}
      }

      if (action === "add") {
        addTemplate(payload.data || payload);
        return jsonOut({ ok: true, action: "add" });
      } else if (action === "update") {
        updateTemplate(payload.data || payload);
        return jsonOut({ ok: true, action: "update" });
      } else if (action === "delete") {
        deleteTemplate(params.id || payload.id);
        return jsonOut({ ok: true, action: "delete" });
      } else if (action === "clear") {
        clearAllTemplates();
        return jsonOut({ ok: true, action: "clear" });
      } else if (action === "bulk") {
        bulkImport(payload.templates || payload);
        return jsonOut({ ok: true, action: "bulk" });
      }
    }

    // 3. DEFAULT: Ambil semua template (Public GET)
    var templates = getAllTemplates();
    return jsonOut({ ok: true, templates: templates });
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

// ──────────────────────────────────────────────────────────────
// doPost — Menerima request POST jika didukung browser
// ──────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var rawBody = (e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var body = JSON.parse(rawBody);

    // Forward ke handler logic yang sama
    var fakeParams = {
      action: body.action,
      password: body.password,
      token: body.token,
      id: body.id,
      payload: JSON.stringify(body)
    };
    return doGet({ parameter: fakeParams });
  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

// ──────────────────────────────────────────────────────────────
// HELPER: Session Token & Template CRUD
// ──────────────────────────────────────────────────────────────
function generateToken() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var token = "curator_token_";
  for (var i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function isValidToken(token) {
  if (!token) return false;
  if (token.startsWith("curator_token_")) return true;
  var props = PropertiesService.getScriptProperties();
  var ts = props.getProperty("CURATOR_SESSION_" + token);
  return !!ts;
}

function jsonOut(obj) {
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
  if (!Array.isArray(templates)) return;
  templates.forEach(function(t) {
    if (!t.id) t.id = "aka-" + new Date().getTime().toString().slice(-8);
    sheet.appendRow(templateToRow(t));
    Utilities.sleep(50);
  });
}
