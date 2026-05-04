// src/lib/voice/urdu-to-devanagari.ts
//
// Char-by-char transliteration from Nastaliq (Urdu script) to Devanagari
// (Hindi script). The output is fed to Google's hi-IN-Wavenet-A voice so
// Pakistani Urdu speakers hear their reply spoken in a natural Hindustani
// accent — instead of the Standard ur-IN voice (concatenative + robotic)
// or the English voice mispronouncing Nastaliq.
//
// Why this works: spoken Urdu and spoken Hindi are essentially the same
// language (Hindustani) at the colloquial register. The scripts diverge,
// but the phonetics are mutually intelligible. A reader who pronounces
// the Devanagari version of an Urdu sentence sounds natural to both
// audiences.
//
// Quality notes:
//   - Persian/Arabic letters with no direct Hindi equivalent (ث ص ط ظ
//     all become स/त/ज़) — Hindi already merges these phonetically, so
//     the audio sounds the same as a native Urdu speaker would say it.
//   - ع (ain) is silent in modern Urdu; we map it to ''.
//   - Diacritics (zabar/zair/pesh) are usually omitted in Urdu writing.
//     Hindi readers will insert implicit schwa (अ) between consonants —
//     which produces the same pronunciation an Urdu speaker would use.
//   - و and ی are context-dependent (consonant vs. vowel). We default to
//     the consonant form (व, य); the implicit schwa filling produces
//     close-to-natural pronunciation in most words.
//
// This is deliberately a static char map, not an LLM call. The win
// comes from Wavenet voice quality + Hindustani phonetics, not from
// perfect orthographic transliteration.

const URDU_TO_DEVA: Record<string, string> = {
  // ── Consonants ───────────────────────────────────────────────────
  "ا": "अ",
  "آ": "आ",
  "ب": "ब",
  "پ": "प",
  "ت": "त",
  "ٹ": "ट",
  "ث": "स",
  "ج": "ज",
  "چ": "च",
  "ح": "ह",
  "خ": "ख",
  "د": "द",
  "ڈ": "ड",
  "ذ": "ज़",
  "ر": "र",
  "ڑ": "ड़",
  "ز": "ज़",
  "ژ": "ज़",
  "س": "स",
  "ش": "श",
  "ص": "स",
  "ض": "ज़",
  "ط": "त",
  "ظ": "ज़",
  "ع": "",
  "غ": "ग़",
  "ف": "फ़",
  "ق": "क़",
  "ک": "क",
  "ك": "क",   // Arabic kaf variant
  "گ": "ग",
  "ل": "ल",
  "م": "म",
  "ن": "न",
  "ں": "ं",   // nasalization
  "و": "व",
  "ہ": "ह",
  "ۃ": "ह",   // ta marbuta
  "ۂ": "ह",
  "ھ": "ह",   // do-chashmi he (aspiration)
  "ی": "य",
  "ي": "य",   // Arabic yeh variant
  "ئ": "ी",
  "ے": "े",

  // ── Hamza ────────────────────────────────────────────────────────
  "ء": "",   // hamza in isolation — usually silent

  // ── Diacritics (rare in Urdu, but handle them if present) ───────
  "َ": "ा",   // zabar (fatha)
  "ِ": "ि",   // zair (kasra)
  "ُ": "ु",   // pesh (damma)
  "ً": "ं",   // tanwin
  "ٍ": "",
  "ٌ": "",
  "ْ": "",   // sukun (no vowel)
  "ّ": "",   // shadda (gemination — handled by repeat)
  "ٓ": "",   // madda
  "ٔ": "",   // hamza above

  // ── Digits (Urdu/Persian numerals → Devanagari numerals) ───────
  "۰": "०",
  "۱": "१",
  "۲": "२",
  "۳": "३",
  "۴": "४",
  "۵": "५",
  "۶": "६",
  "۷": "७",
  "۸": "८",
  "۹": "९",

  // ── Punctuation ─────────────────────────────────────────────────
  "۔": "।",   // Urdu full stop
  "،": ",",   // Urdu comma
  "؟": "?",   // Urdu question mark
  "؛": ";",   // Urdu semicolon
};

/**
 * Transliterate Nastaliq (Urdu script) text to Devanagari (Hindi script)
 * for TTS via Google's hi-IN voice.
 *
 * Non-Urdu characters (Latin letters, numbers, ASCII punctuation,
 * existing Devanagari, etc.) pass through untouched. This means a mixed
 * Urdu+English reply ("آپ کا GPA کیا ہے؟") transliterates to
 * Devanagari for Urdu words while keeping "GPA" in Latin script —
 * which Google's hi-IN voice handles natively.
 */
export function transliterateUrduToDevanagari(text: string): string {
  if (!text) return text;
  let out = "";
  for (const ch of text) {
    const mapped = URDU_TO_DEVA[ch];
    out += mapped !== undefined ? mapped : ch;
  }
  return out;
}

/**
 * True if the string contains any Nastaliq characters worth
 * transliterating. Used to skip the work on already-Devanagari or
 * pure-English replies.
 */
export function containsNastaliq(text: string): boolean {
  if (!text) return false;
  // U+0600–U+06FF is the Arabic Unicode block, which covers Nastaliq.
  // U+0750–U+077F + U+FB50–U+FDFF + U+FE70–U+FEFF are extensions used
  // for Urdu/Pashto-specific letters.
  return /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(text);
}
