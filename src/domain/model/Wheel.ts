/**
 * COUCHE : DOMAINE
 *
 * Rôle du fichier : la ROUE, un « objet-valeur » (value object) du domaine.
 *
 * Un objet-valeur est défini uniquement par ses valeurs (sa position et son diamètre) : il n'a pas d'identité propre
 * et ne change jamais après sa création (immuable). Deux roues avant-gauche de 17 pouces sont interchangeables.
 *
 * Les règles métier de la roue vivent ICI, et nulle part ailleurs :
 * - son diamètre est compris entre 14 et 22 pouces ;
 * - sa position est l'un des quatre coins de la voiture.
 * Le constructeur est privé : on ne peut obtenir une roue que par `Wheel.create`, qui vérifie ces règles.
 * Il est donc impossible d'avoir une roue invalide en mémoire.
 */
import { InvalidCarError } from "../errors/InvalidCarError.js";

/** Les quatre emplacements possibles d'une roue. */
export type WheelPosition = "avant-gauche" | "avant-droite" | "arriere-gauche" | "arriere-droite";

/** La liste des quatre positions, dans l'ordre où l'on monte les roues. */
export const WHEEL_POSITIONS: readonly WheelPosition[] = ["avant-gauche", "avant-droite", "arriere-gauche", "arriere-droite"];

export class Wheel {
  static readonly MIN_DIAMETER_INCHES = 14;
  static readonly MAX_DIAMETER_INCHES = 22;

  private constructor(
    readonly position: WheelPosition,
    readonly diameterInches: number,
  ) {}

  /** Fabrique une roue en vérifiant les règles métier. */
  static create(position: WheelPosition, diameterInches: number): Wheel {
    if (!Number.isFinite(diameterInches) || diameterInches < Wheel.MIN_DIAMETER_INCHES || diameterInches > Wheel.MAX_DIAMETER_INCHES) {
      throw new InvalidCarError(
        `Une roue doit mesurer entre ${Wheel.MIN_DIAMETER_INCHES} et ${Wheel.MAX_DIAMETER_INCHES} pouces (reçu : ${diameterInches}).`,
      );
    }
    return new Wheel(position, diameterInches);
  }
}
