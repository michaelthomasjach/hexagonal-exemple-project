/**
 * COUCHE : DOMAINE
 *
 * Rôle du fichier : le MOTEUR, un objet-valeur du domaine.
 *
 * Règles métier portées par le moteur :
 * - sa puissance est un nombre strictement positif de chevaux, au plus 2 000 ;
 * - il est soit à l'arrêt, soit en marche ; on le démarre et on l'arrête par des méthodes dédiées.
 *
 * Comme la roue et le volant, il est immuable : `start()` renvoie un nouveau moteur « en marche ».
 */
import { InvalidCarError } from "../errors/InvalidCarError.js";

export class Engine {
  static readonly MAX_POWER_HP = 2000;

  private constructor(
    readonly powerHp: number,
    readonly running: boolean,
  ) {}

  /** Fabrique un moteur à l'arrêt, en vérifiant sa puissance. */
  static create(powerHp: number): Engine {
    if (!Number.isFinite(powerHp) || powerHp <= 0 || powerHp > Engine.MAX_POWER_HP) {
      throw new InvalidCarError(`Un moteur doit avoir une puissance entre 1 et ${Engine.MAX_POWER_HP} ch (reçu : ${powerHp}).`);
    }
    return new Engine(powerHp, false);
  }

  start(): Engine {
    return new Engine(this.powerHp, true);
  }

  stop(): Engine {
    return new Engine(this.powerHp, false);
  }
}
