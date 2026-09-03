#!/usr/bin/env node
/**
 * TRIA LAB — Mystery Professional Build
 * Bundles all JS into single obfuscated file + encodes data payloads
 * so Network tab shows only app.min.js with gibberish.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as esbuild from "esbuild";
import JavaScriptObfuscator from "javascript-obfuscator";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const isDev = process.argv.includes("--dev");

const KEY = "TRIA_LAB2026";
function encode(obj) {
  const json = JSON.stringify(obj, (k, v) => (v === Infinity ? "__INF__" : v));
  const data = Buffer.from(json, "utf8");
  const keyBytes = Buffer.from(KEY, "utf8");
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ keyBytes[i % keyBytes.length];
  return out.toString("base64");
}

// ---- Load raw data via dynamic import ----
async function loadData() {
  const websitesMod = await import(pathToFileURL(path.join(root, "assets/js/data/websites.js")).href);
  const pricingConfigMod = await import(pathToFileURL(path.join(root, "assets/js/data/pricing-config.js")).href);
  const servicesMod = await import(pathToFileURL(path.join(root, "assets/js/data/services.js")).href);
  const pricingMod = await import(pathToFileURL(path.join(root, "assets/js/data/pricing.js")).href);
  return { websitesMod, pricingConfigMod, servicesMod, pricingMod };
}
function pathToFileURL(p) {
  const u = new URL("file://" + p.replace(/\\/g, "/"));
  return u;
}

const vaultPlugin = (payloads) => ({
  name: "tria-vault",
  setup(build) {
    build.onLoad({ filter: /[/\\]data[/\\]websites\.js$/ }, async () => {
      const v = encode({ CATEGORIES: payloads.websitesMod.CATEGORIES, WEBSITES: payloads.websitesMod.WEBSITES });
      return {
        contents: `
import { _j } from "../utils/vault.js";
const _v = "${v}";
const _d = _j(_v);
export const CATEGORIES = _d.CATEGORIES;
export const WEBSITES = _d.WEBSITES;
export function getWebsiteByCode(code){ return WEBSITES.find(s=>s.code===code); }
`,
        loader: "js",
      };
    });
    build.onLoad({ filter: /[/\\]data[/\\]pricing-config\.js$/ }, async () => {
      const v = encode({
        WEBSITE_TYPES: payloads.pricingConfigMod.WEBSITE_TYPES,
        PAGE_PRICING: payloads.pricingConfigMod.PAGE_PRICING,
        FEATURE_GROUPS: payloads.pricingConfigMod.FEATURE_GROUPS,
        MAINTENANCE_OPTIONS: payloads.pricingConfigMod.MAINTENANCE_OPTIONS,
      });
      return {
        contents: `
import { _j } from "../utils/vault.js";
const _v = "${v}";
const _d = _j(_v);
export const WEBSITE_TYPES = _d.WEBSITE_TYPES;
export const PAGE_PRICING = _d.PAGE_PRICING;
export const FEATURE_GROUPS = _d.FEATURE_GROUPS;
export const MAINTENANCE_OPTIONS = _d.MAINTENANCE_OPTIONS;
export const FEATURE_PRICE_MAP = (()=>{ const m=new Map(); for(const g of FEATURE_GROUPS) for(const it of g.items) m.set(it.id,it.price); for(const o of MAINTENANCE_OPTIONS) m.set(o.id,o.price); for(const t of WEBSITE_TYPES) m.set(t.id,t.price); return m; })();
`,
        loader: "js",
      };
    });
    build.onLoad({ filter: /[/\\]data[/\\]services\.js$/ }, async () => {
      const v = encode({ SERVICES: payloads.servicesMod.SERVICES });
      return {
        contents: `
import { _j } from "../utils/vault.js";
const _v = "${v}";
const _d = _j(_v);
export const SERVICES = _d.SERVICES;
`,
        loader: "js",
      };
    });
    build.onLoad({ filter: /[/\\]data[/\\]pricing\.js$/ }, async () => {
      const v = encode({ PRICING_PLANS: payloads.pricingMod.PRICING_PLANS });
      return {
        contents: `
import { _j } from "../utils/vault.js";
const _v = "${v}";
const _d = _j(_v);
export const PRICING_PLANS = _d.PRICING_PLANS;
`,
        loader: "js",
      };
    });
  },
});

async function main() {
  const payloads = await loadData();
  const entry = path.join(root, "assets/js/bundle.entry.js");
  const outDir = path.join(root, "assets/dist");
  const outFile = path.join(outDir, "tria.app.min.js");
  fs.mkdirSync(outDir, { recursive: true });

  // Ensure vault decoder handles __INF__ revive
  // Patch vault.js _j to revive Infinity (injected at build time via plugin, but also update source)
  // We already have vault.js, ensure it handles __INF__

  console.log("• Bundling with esbuild...");
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ["es2017"],
    format: "esm",
    outfile: path.join(root, "tmp/app.bundle.js"),
    plugins: [vaultPlugin(payloads)],
    logLevel: "info",
    treeShaking: true,
  });

  let code = fs.readFileSync(path.join(root, "tmp/app.bundle.js"), "utf8");

  if (!isDev) {
    console.log("• Obfuscating (mystery) ...");
    const ob = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.6,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.2,
      stringArray: true,
      stringArrayThreshold: 1,
      stringArrayEncoding: ["base64"],
      rotateStringArray: true,
      numbersToExpressions: true,
      identifierNamesGenerator: "hexadecimal",
      selfDefending: false,
      disableConsoleOutput: false,
      splitStrings: true,
      splitStringsChunkLength: 5,
      transformObjectKeys: false,
      unicodeEscapeSequence: false,
    });
    code = ob.getObfuscatedCode();
  } else {
    console.log("• Dev mode: skip obfuscation");
  }

  // Add header watermark comment (will be obfuscated but keep tiny)
  const header = `/*! TRIA LAB | Professional | ${new Date().toISOString().slice(0,10)} */\n`;
  fs.writeFileSync(outFile, header + code, "utf8");
  const size = (fs.statSync(outFile).size / 1024).toFixed(1);
  console.log(`✓ Built ${path.relative(root, outFile)} (${size} KB) ${isDev ? "(dev)" : "(obfuscated)"}`);

  // Clean tmp
  try { fs.rmSync(path.join(root, "tmp"), { recursive: true, force: true }); } catch {}

  // Also copy CSS min hint (optional)
  console.log("• Build complete. Use: <script type=\"module\" src=\"assets/dist/tria.app.min.js\"></script>");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
