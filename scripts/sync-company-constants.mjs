/**
 * Regenera emprenorsolutions/public/content.json con datos de shared/company.constants.json
 * Ejecutar desde la raíz del monorepo: node scripts/sync-company-constants.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const company = JSON.parse(
  readFileSync(path.join(root, 'shared/company.constants.json'), 'utf8'),
);
const contentPath = path.join(root, 'emprenorsolutions/public/content.json');

const content = JSON.parse(readFileSync(contentPath, 'utf8'));

const replacements = new Map([
  ['+54 9 387 352-2920', company.telefonoSecundario.telefono],
  ['543873522920', company.telefonoSecundario.whatsapp],
  ['5491127586521', company.telefonoPrincipal.whatsapp],
  ['+54 9 11 2758-6521', company.telefonoPrincipal.telefono],
  ['Ituzaingó 920', company.titular.domicilioCalle],
  ['Ituzaingó 920, Salta Capital — Cobertura NOA', company.titular.domicilioComercial],
  ['Salta Capital, Provincia de Salta', company.titular.domicilioCiudad],
  ['RM INTERNATIONAL GROUP SAS', company.titular.nombreCompleto],
  ['30-71603601-0', company.titular.cuit],
  [
    'EMPRENOR C&S — RM INTERNATIONAL GROUP SAS. Obras públicas, educación, salud e industria en Salta, Jujuy, Tucumán y Formosa.',
    company.site.descriptionShort,
  ],
  [
    'EMPRENOR C&S — RM INTERNATIONAL GROUP SAS. Obras públicas, educación, salud e industria en Salta, Jujuy, Tucumán y Formosa. Certificaciones ISO 9001, AEA 90364 y SIGCE.',
    `${company.site.descriptionShort} Obras privadas, comerciales, industriales, corporativas y públicas.`,
  ],
  [
    'Consultas, presupuestos y briefing de proyecto. Equipo técnico en Ituzaingó 920, Salta Capital.',
    `Consultas, presupuestos y briefing de proyecto. Sede fiscal: ${company.titular.domicilioCalle}, Salta.`,
  ],
  ['MAYO 2018 — RM INTERNATIONAL GROUP SAS', `${company.titular.foundedLabel} — ${company.brand.siglas}`],
  ['Mayo 2018', company.titular.foundedLabel],
]);

function replaceValue(value) {
  if (typeof value !== 'string') return value;
  let next = value;
  for (const [from, to] of replacements) {
    if (next.includes(from)) next = next.replaceAll(from, to);
  }
  return next;
}

function walk(node) {
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, walk(value)]));
  }
  return replaceValue(node);
}

const synced = walk(content);

// Asegurar teléfono principal en nav/contacto del fallback estático
for (const item of synced.siteContent || []) {
  if (item.key === 'phone_main' || item.key === 'nav_phone_display') {
    item.value = company.telefonoPrincipal.telefono;
  }
  if (item.key === 'phone_link' || item.key === 'nav_phone_link' || item.key === 'whatsapp') {
    item.value = company.telefonoPrincipal.whatsapp;
  }
  if (item.key === 'company_name') item.value = company.titular.nombreCompleto;
  if (item.key === 'cuit') item.value = company.titular.cuit;
  if (item.key === 'headquarters') item.value = company.titular.domicilioComercial;
  if (item.key === 'address_street') item.value = company.titular.domicilioCalle;
  if (item.key === 'address_city') item.value = company.titular.domicilioCiudad;
  if (item.key === 'description_short') item.value = company.site.descriptionShort;
}

writeFileSync(contentPath, `${JSON.stringify(synced, null, 2)}\n`, 'utf8');
console.log(`Synced ${contentPath} from shared/company.constants.json`);
