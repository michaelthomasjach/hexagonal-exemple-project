/**
 * COUCHE : APPLICATION
 *
 * Rôle du fichier : l'erreur levée quand on demande une voiture qui n'existe pas.
 *
 * Elle appartient à l'application et non au domaine : « introuvable » n'est pas une règle métier de la voiture,
 * c'est la conséquence d'une recherche dans le dépôt (le port `CarRepository`).
 */
export class CarNotFoundError extends Error {
  constructor(readonly carId: string) {
    super(`Aucune voiture avec l'identifiant « ${carId} ».`);
    this.name = "CarNotFoundError";
  }
}
