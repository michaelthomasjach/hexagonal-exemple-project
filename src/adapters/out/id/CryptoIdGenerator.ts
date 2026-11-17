/**
 * COUCHE : ADAPTATEURS — ADAPTATEUR SORTANT
 *
 * Rôle du fichier : une IMPLÉMENTATION du port sortant `IdGenerator`, qui s'appuie sur le module `node:crypto` de
 * Node.js pour produire un UUID (ex. « 3f2b8c1e-… »).
 *
 * C'est le seul endroit du projet qui dépend de `node:crypto` : la technologie est confinée dans un adaptateur, à
 * la périphérie de l'hexagone, loin du domaine.
 */
import { randomUUID } from "node:crypto";
import type { IdGenerator } from "../../../application/ports/out/IdGenerator.js";

export class CryptoIdGenerator implements IdGenerator {
  next(): string {
    return randomUUID();
  }
}
