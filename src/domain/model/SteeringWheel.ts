/**
 * COUCHE : DOMAINE
 *
 * Rôle du fichier : le VOLANT, un objet-valeur du domaine.
 *
 * Il connaît son angle de rotation (0° = roues droites, positif = à droite, négatif = à gauche) et la règle métier
 * qui le limite : un volant ne tourne pas au-delà d'une butée de 540° (un tour et demi) de chaque côté.
 *
 * Il est immuable : tourner le volant ne modifie pas l'objet, cela renvoie un NOUVEAU volant avec le nouvel angle.
 * C'est un choix courant dans le domaine : l'état ne change qu'à travers des méthodes qui respectent les règles.
 */
export class SteeringWheel {
  /** Butée du volant, en degrés, de chaque côté. */
  static readonly MAX_ANGLE_DEGREES = 540;

  private constructor(readonly angleDegrees: number) {}

  /** Un volant neuf, roues droites. */
  static centered(): SteeringWheel {
    return new SteeringWheel(0);
  }

  /** Tourne le volant de `degrees` (négatif : vers la gauche). L'angle s'arrête à la butée. */
  turn(degrees: number): SteeringWheel {
    const max = SteeringWheel.MAX_ANGLE_DEGREES;
    const next = Math.max(-max, Math.min(max, this.angleDegrees + degrees));
    return new SteeringWheel(next);
  }

  /** Sens dans lequel la voiture tourne, en mots. */
  get direction(): "tout droit" | "à gauche" | "à droite" {
    if (this.angleDegrees === 0) return "tout droit";
    return this.angleDegrees < 0 ? "à gauche" : "à droite";
  }
}
