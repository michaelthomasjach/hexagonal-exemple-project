/**
 * COUCHE : DOMAINE (le cœur de l'hexagone)
 *
 * Rôle du fichier : l'erreur métier levée quand une règle de construction de la voiture n'est pas respectée
 * (pas exactement quatre roues, diamètre de roue impossible, moteur sans puissance…).
 *
 * Pourquoi une erreur dédiée ? Parce que le domaine doit pouvoir dire « cette demande viole une règle métier »
 * sans savoir qui l'appelle. C'est ensuite à l'adaptateur (ici la ligne de commande, demain une API HTTP) de
 * traduire cette erreur dans son propre langage : un message à l'écran, un code HTTP 400, etc.
 *
 * Le domaine n'importe RIEN de l'extérieur : ni Node.js, ni base de données, ni framework.
 */
export class InvalidCarError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCarError";
  }
}
