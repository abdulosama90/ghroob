import { PRAYERS, prayerByKey } from "../../../packages/core/src/prayers.mjs";
import {
  activePendingOccurrence,
  createLedger,
  markActivePrayerPrayed,
  nextOccurrence,
  pruneLedger,
  startAtCurrentPrayer,
} from "../../../packages/core/src/state.mjs";
import { createBrowserStore } from "../../../packages/core/src/storage.mjs";
import { calculatedPrayerWindow } from "../../../packages/core/src/providers/calculated.mjs";
import { Geolocation } from "@capacitor/geolocation";
import {
  COUNTRY_OPTIONS,
  METHOD_OPTIONS,
  countryForTimeZone,
  countryPreset,
  methodOption,
} from "../../../packages/core/src/providers/catalog.mjs";

const DEFAULT_SETTINGS = Object.freeze({
  latitude: 40.8028,
  longitude: 29.4307,
  timeZone: "Europe/Istanbul",
  locality: "Gebze, Kocaeli",
  country: "TR",
  method: "turkey",
  madhab: "hanafi",
  interactive: true,
  sound: true,
  provider: "calculated",
});

const store = createBrowserStore();
const saved = store.load() ?? {};
const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_SETTINGS.timeZone;
const detectedRegion = (() => {
  try { return new Intl.Locale(navigator.language).region || ""; } catch { return ""; }
})();
const detectedCountry = countryForTimeZone(detectedTimeZone, detectedRegion);
const detectedPreset = countryPreset(detectedCountry);
const detectedSettings = detectedCountry === "TR"
  ? { country: "TR", method: "turkey", timeZone: detectedTimeZone }
  : {
      country: detectedCountry,
      method: detectedPreset.method,
      timeZone: detectedTimeZone,
      locality: "",
      latitude: "",
      longitude: "",
    };
let settings = { ...DEFAULT_SETTINGS, ...detectedSettings, ...(saved.settings ?? {}) };
let onboardingCompleted = Boolean(saved.onboardingCompleted);
let view = onboardingCompleted ? "prayer" : "onboarding";
let schedule = calculateSchedule();
let ledger = saved.ledger
  ? pruneLedger(saved.ledger)
  : createLedger({ trackingStartedAt: startAtCurrentPrayer(schedule) });

function calculateSchedule(now = new Date()) {
  return calculatedPrayerWindow({
    latitude: Number(settings.latitude),
    longitude: Number(settings.longitude),
    timeZone: settings.timeZone,
    method: settings.method,
    madhab: settings.madhab,
  }, now);
}

function persist() {
  store.save({ settings, ledger: pruneLedger(ledger), onboardingCompleted });
}

function escapeAttribute(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function countryOptions(selected) {
  return COUNTRY_OPTIONS.map(({ code, ar, en }) => (
    `<option value="${code}" ${code === selected ? "selected" : ""}>${ar} · ${en}</option>`
  )).join("");
}

function methodOptions(selected) {
  return METHOD_OPTIONS.map(({ id, label }) => (
    `<option value="${id}" ${id === selected ? "selected" : ""}>${label}</option>`
  )).join("");
}

function authoritySummary(country = settings.country, method = settings.method) {
  const preset = countryPreset(country);
  const selectedMethod = methodOption(method);
  return `<b>${preset.authority}</b><span>${preset.note}</span><small>طريقة الحساب: ${selectedMethod.label}</small>`;
}

function readConfiguration(form) {
  return {
    ...settings,
    country: String(form.get("country") || DEFAULT_SETTINGS.country),
    locality: String(form.get("locality") || DEFAULT_SETTINGS.locality),
    latitude: Number(form.get("latitude") || DEFAULT_SETTINGS.latitude),
    longitude: Number(form.get("longitude") || DEFAULT_SETTINGS.longitude),
    timeZone: String(form.get("timeZone") || DEFAULT_SETTINGS.timeZone),
    method: String(form.get("method") || DEFAULT_SETTINGS.method),
    madhab: String(form.get("madhab") || DEFAULT_SETTINGS.madhab),
    interactive: form.has("interactive"),
    sound: form.has("sound"),
  };
}

function formatClock(date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: settings.timeZone,
  }).format(date).replace(/\s?(am|pm)/i, "");
}

function formatArabicDate(date) {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: settings.timeZone,
  }).format(date);
}

function formatHijri(date) {
  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: settings.timeZone,
  }).format(date);
}

function durationArabic(milliseconds) {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourPart = hours ? `${hours} ${hours === 1 ? "ساعة" : "ساعات"}` : "";
  const minutePart = minutes ? `${minutes} دقيقة` : "";
  return [hourPart, minutePart].filter(Boolean).join(" و") || "أقل من دقيقة";
}

function currentDaySchedule(now) {
  const day = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: settings.timeZone,
  }).format(now);
  return schedule.filter((item) => item.dayKey === day);
}

function skyState(now, today) {
  const fajr = today.find((item) => item.key === "fajr")?.at;
  const dhuhr = today.find((item) => item.key === "dhuhr")?.at;
  const maghrib = today.find((item) => item.key === "maghrib")?.at;
  if (!fajr || !dhuhr || !maghrib) return { phase: "night", sun: 0, sunY: 70 };
  if (now < fajr || now >= maghrib) return { phase: "night", sun: 0, sunY: 70 };
  const daylight = maghrib - fajr;
  const progress = Math.max(0, Math.min(1, (now - fajr) / daylight));
  const phase = now < new Date(fajr.getTime() + 60 * 60_000)
    ? "dawn"
    : now > new Date(maghrib.getTime() - 60 * 60_000)
      ? "sunset"
      : now < dhuhr ? "morning" : "afternoon";
  return {
    phase,
    sun: Math.round(progress * 100),
    sunY: Math.round(70 - Math.sin(progress * Math.PI) * 52),
  };
}

function progressBetween(now, from, to) {
  if (!from || !to || to <= from) return 0;
  return Math.max(0, Math.min(100, ((now - from) / (to - from)) * 100));
}

function renderPrayer(now) {
  const pending = activePendingOccurrence(schedule, ledger, now);
  const next = nextOccurrence(schedule, now);
  const today = currentDaySchedule(now);
  const sky = skyState(now, today);
  const pendingPrayer = pending && prayerByKey(pending.key);
  const nextPrayer = next && prayerByKey(next.key);
  const following = pending
    ? schedule.find((item) => item.at > pending.at) ?? next
    : next;
  const titlePrayer = pendingPrayer ?? nextPrayer;
  const progress = pending
    ? progressBetween(now, pending.at, following?.at)
    : (() => {
        const previous = [...schedule].reverse().find((item) => item.at <= now);
        return progressBetween(now, previous?.at, next?.at);
      })();

  return `
    <section class="kiosk sky-${sky.phase}" style="--sun-progress:${sky.sun}%;--sun-y:${sky.sunY}%">
      <div class="stars" aria-hidden="true"></div>
      <div class="sun" aria-hidden="true"></div>
      <div class="moon" aria-hidden="true"></div>
      <div class="cloud cloud-far one" aria-hidden="true"></div>
      <div class="cloud cloud-far two" aria-hidden="true"></div>
      <div class="cloud cloud-near" aria-hidden="true"></div>
      <div class="horizon" aria-hidden="true"></div>

      <header class="topbar">
        <time class="clock" dir="ltr">${formatClock(now)}</time>
        <div class="date-block">
          <strong>${formatArabicDate(now)}</strong>
          <span>${formatHijri(now)}</span>
        </div>
      </header>

      <div class="content">
        <aside class="prayer-rail" aria-label="مواقيت الصلاة">
          ${today.map((item) => {
            const prayer = prayerByKey(item.key);
            const isActive = pending?.id === item.id || (!pending && next?.id === item.id);
            const isDone = Boolean(ledger.completions[item.id]);
            return `<div class="rail-row ${isActive ? "active" : ""} ${isDone ? "done" : ""}">
              <i></i><span>${prayer.ar}</span><time dir="ltr">${formatClock(item.at)}</time>
            </div>`;
          }).join("")}
        </aside>

        <article class="hero">
          <p class="eyebrow">${pending ? "لم تصلِّ" : "الوقت حتى"}</p>
          <h1>${titlePrayer ? `صلاة ${titlePrayer.ar}` : "مواقيت الصلاة"}</h1>
          <p class="description">${pending
            ? `دخل وقت صلاة ${pendingPrayer.ar} منذ ${durationArabic(now - pending.at)}.`
            : next
              ? `باقٍ ${durationArabic(next.at - now)} حتى وقت صلاة ${nextPrayer.ar}.`
              : "سيظهر وقت الصلاة التالية هنا."}</p>
          <div class="action-row">
            ${pending && settings.interactive ? `<button class="prayed" data-action="prayed">صلّيت</button>` : "<span></span>"}
            <div class="progress" aria-label="التقدم نحو الصلاة التالية"><b style="width:${progress}%"></b></div>
          </div>
        </article>
      </div>

      <button class="gear" data-action="settings" aria-label="الإعدادات">⚙</button>
    </section>`;
}

function renderSettings(now) {
  return `
    <section class="kiosk settings sky-morning">
      <header class="topbar settings-topbar">
        <time class="clock" dir="ltr">${formatClock(now)}</time>
        <div class="date-block"><strong>الإعدادات</strong><span>الجهاز والمواقيت</span></div>
      </header>
      <form class="settings-panel" data-settings>
        <div class="settings-grid">
          <label><span>الدولة</span><select name="country">${countryOptions(settings.country)}</select></label>
          <label><span>المدينة أو المنطقة</span><input name="locality" value="${escapeAttribute(settings.locality)}" required /></label>
          <label><span>طريقة حساب المواقيت</span><select name="method">${methodOptions(settings.method)}</select></label>
          <label><span>المذهب لحساب العصر</span><select name="madhab"><option value="hanafi" ${settings.madhab === "hanafi" ? "selected" : ""}>حنفي</option><option value="shafi" ${settings.madhab === "shafi" ? "selected" : ""}>شافعي / مالكي / حنبلي</option></select></label>
          <label><span>المنطقة الزمنية</span><input name="timeZone" value="${escapeAttribute(settings.timeZone)}" required /></label>
        </div>
        <div class="coordinates">
          <label><span>خط العرض</span><input name="latitude" type="number" min="-90" max="90" step="0.0001" value="${settings.latitude}" required /></label>
          <label><span>خط الطول</span><input name="longitude" type="number" min="-180" max="180" step="0.0001" value="${settings.longitude}" required /></label>
        </div>
        <label class="switch-row"><span><b>شاشة تفاعلية</b><small>إظهار زر «صلّيت» وحفظ السجل على هذا الجهاز</small></span><input name="interactive" type="checkbox" ${settings.interactive ? "checked" : ""} /></label>
        <label class="switch-row"><span><b>الصوت</b><small>يُستخدم عند تثبيت غلاف Android للصوت والتنبيهات</small></span><input name="sound" type="checkbox" ${settings.sound ? "checked" : ""} /></label>
        <p class="provider-note" data-authority>${authoritySummary()}</p>
        <div class="settings-actions">
          <button type="button" class="secondary" data-action="onboarding">إعداد الموقع من جديد</button>
          <button type="button" class="secondary" data-action="close-settings">إلغاء</button>
          <button type="submit" class="prayed">حفظ</button>
        </div>
      </form>
    </section>`;
}

function renderOnboarding() {
  return `
    <section class="kiosk onboarding sky-morning">
      <div class="sun onboarding-sun" aria-hidden="true"></div>
      <div class="horizon" aria-hidden="true"></div>
      <div class="onboarding-card">
        <header>
          <p class="step">إعداد Salah Screen</p>
          <h1>مواقيتك تبدأ من مكانك</h1>
          <p>نقترح طريقة مناسبة للدولة، ثم تراجعها أنت مع المسجد أو الجهة المحلية. لن نخفي مصدر الوقت أو نخمنه بصمت.</p>
        </header>
        <form data-onboarding>
          <div class="setup-grid">
            <label><span>الدولة</span><select name="country">${countryOptions(settings.country)}</select></label>
            <label><span>المدينة أو المنطقة</span><input name="locality" value="${escapeAttribute(settings.locality)}" required /></label>
            <label><span>طريقة حساب المواقيت</span><select name="method">${methodOptions(settings.method)}</select></label>
            <label><span>المذهب لحساب العصر</span><select name="madhab"><option value="hanafi" ${settings.madhab === "hanafi" ? "selected" : ""}>حنفي</option><option value="shafi" ${settings.madhab === "shafi" ? "selected" : ""}>شافعي / مالكي / حنبلي</option></select></label>
            <label class="timezone"><span>المنطقة الزمنية</span><input name="timeZone" value="${escapeAttribute(settings.timeZone || detectedTimeZone)}" required /></label>
          </div>
          <div class="location-row">
            <label><span>خط العرض</span><input name="latitude" type="number" min="-90" max="90" step="0.0001" value="${settings.latitude}" required /></label>
            <label><span>خط الطول</span><input name="longitude" type="number" min="-180" max="180" step="0.0001" value="${settings.longitude}" required /></label>
            <button type="button" class="secondary locate" data-action="locate">استخدم موقعي</button>
          </div>
          <p class="location-status" data-location-status>الموقع يبقى على هذا الجهاز ولا يُرسل إلى حساب مركزي.</p>
          <div class="recommendation" data-authority>${authoritySummary()}</div>
          <div class="onboarding-options">
            <label class="switch-row"><span><b>شاشة تفاعلية</b><small>إظهار زر «صلّيت» وحفظ السجل محلياً</small></span><input name="interactive" type="checkbox" ${settings.interactive ? "checked" : ""} /></label>
            <label class="switch-row"><span><b>الصوت</b><small>السماح بالأذان والتنبيهات عند اكتمال خدمة Android</small></span><input name="sound" type="checkbox" ${settings.sound ? "checked" : ""} /></label>
          </div>
          <button type="submit" class="prayed start">ابدأ</button>
        </form>
      </div>
    </section>`;
}

function render() {
  const now = new Date();
  document.querySelector("#app").innerHTML = view === "onboarding"
    ? renderOnboarding()
    : view === "settings" ? renderSettings(now) : renderPrayer(now);
  bindEvents();
}

function bindEvents() {
  document.querySelector("[data-action='prayed']")?.addEventListener("click", () => {
    const result = markActivePrayerPrayed({ occurrences: schedule, ledger, now: new Date() });
    ledger = result.ledger;
    persist();
    render();
  });
  document.querySelector("[data-action='settings']")?.addEventListener("click", () => {
    view = "settings";
    render();
  });
  document.querySelector("[data-action='close-settings']")?.addEventListener("click", () => {
    view = "prayer";
    render();
  });
  document.querySelector("[data-action='onboarding']")?.addEventListener("click", () => {
    view = "onboarding";
    render();
  });
  document.querySelectorAll("select[name='country']").forEach((select) => {
    select.addEventListener("change", (event) => {
      const form = event.currentTarget.closest("form");
      const preset = countryPreset(event.currentTarget.value);
      form.querySelector("select[name='method']").value = preset.method;
      form.querySelector("[data-authority]").innerHTML = authoritySummary(preset.country, preset.method);
    });
  });
  document.querySelectorAll("select[name='method']").forEach((select) => {
    select.addEventListener("change", (event) => {
      const form = event.currentTarget.closest("form");
      form.querySelector("[data-authority]").innerHTML = authoritySummary(
        form.querySelector("select[name='country']").value,
        event.currentTarget.value,
      );
    });
  });
  document.querySelector("[data-action='locate']")?.addEventListener("click", async () => {
    const status = document.querySelector("[data-location-status]");
    status.textContent = "جارٍ تحديد الموقع…";
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 86_400_000,
      });
      const form = document.querySelector("[data-onboarding]");
      form.elements.latitude.value = position.coords.latitude.toFixed(5);
      form.elements.longitude.value = position.coords.longitude.toFixed(5);
      form.elements.timeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || settings.timeZone;
      status.textContent = "تم تحديد الموقع على هذا الجهاز. راجع المدينة وطريقة المواقيت قبل البدء.";
    } catch {
      status.textContent = "تعذر تحديد الموقع. أدخل خط العرض والطول يدوياً.";
    }
  });
  document.querySelector("[data-onboarding]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    settings = readConfiguration(new FormData(event.currentTarget));
    schedule = calculateSchedule();
    ledger = createLedger({ trackingStartedAt: startAtCurrentPrayer(schedule) });
    onboardingCompleted = true;
    persist();
    view = "prayer";
    render();
  });
  document.querySelector("[data-settings]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    settings = readConfiguration(new FormData(event.currentTarget));
    schedule = calculateSchedule();
    persist();
    view = "prayer";
    render();
  });
}

render();
setInterval(render, 30_000);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}
