/**
 * COUCHE : APPLICATION — PORT SORTANT
 *
 * Rôle du fichier : l'INTERFACE qui fournit un identifiant unique pour chaque nouvelle voiture.
 *
 * Pourquoi un port pour quelque chose d'aussi simple ? Parce qu'un identifiant aléatoire rend les tests
 * imprévisibles. Grâce à ce port, l'application réelle utilise des UUID (`adapters/out/id/CryptoIdGenerator.ts`)
 * et les tests branchent un générateur qui renvoie toujours la même valeur. Même principe pour l'heure, le hasard,
 * l'envoi d'e-mails… : tout ce qui sort du « pur calcul » passe par un port.
 */
export interface IdGenerator {
  next(): string;
}
