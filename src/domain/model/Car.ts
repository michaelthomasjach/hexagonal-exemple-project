/**
 * COUCHE : DOMAINE
 *
 * Rôle du fichier : la VOITURE, l'« agrégat » (aggregate root) du domaine.
 *
 * Un agrégat regroupe des objets qui n'ont de sens qu'ensemble (ici : 4 roues, 1 volant, 1 moteur) et garantit
 * leurs règles communes. On ne manipule jamais une roue ou le moteur directement depuis l'extérieur : on passe
 * toujours par la voiture, qui vérifie que tout reste cohérent.
 *
 * Contrairement aux roues, la voiture a une IDENTITÉ (`id`) : deux voitures identiques restent deux voitures.
 *
 * Règles métier garanties par ce fichier :
 * - une voiture a exactement quatre roues, une à chaque coin, toutes du même diamètre ;
 * - elle a exactement un volant et un moteur ;
 * - on ne peut tourner le volant que moteur démarré.
 *
 * Ce fichier ne sait RIEN de la façon dont la voiture est enregistrée, affichée ou demandée : c'est tout l'intérêt
 * de l'architecture hexagonale. Le domaine est du TypeScript pur, testable sans base de données ni serveur.
 */
import { InvalidCarError } from "../errors/InvalidCarError.js";
import { Engine } from "./Engine.js";
import { SteeringWheel } from "./SteeringWheel.js";
import { WHEEL_POSITIONS, Wheel } from "./Wheel.js";

/** Ce qu'il faut pour assembler une voiture. */
export interface CarParts {
  id: string;
  model: string;
  wheels: Wheel[];
  steeringWheel: SteeringWheel;
  engine: Engine;
}

export class Car {
  private constructor(
    readonly id: string,
    readonly model: string,
    readonly wheels: readonly Wheel[],
    readonly steeringWheel: SteeringWheel,
    readonly engine: Engine,
  ) {}

  /** Assemble une voiture en vérifiant toutes les règles métier. Seul moyen d'obtenir une `Car`. */
  static assemble(parts: CarParts): Car {
    const model = parts.model.trim();
    if (!model) throw new InvalidCarError("Une voiture doit avoir un nom de modèle.");

    if (parts.wheels.length !== 4) {
      throw new InvalidCarError(`Une voiture a exactement 4 roues (reçu : ${parts.wheels.length}).`);
    }
    const positions = new Set(parts.wheels.map((w) => w.position));
    if (WHEEL_POSITIONS.some((p) => !positions.has(p))) {
      throw new InvalidCarError("Il faut une roue à chaque coin : avant-gauche, avant-droite, arrière-gauche, arrière-droite.");
    }
    const diameters = new Set(parts.wheels.map((w) => w.diameterInches));
    if (diameters.size !== 1) {
      throw new InvalidCarError("Les quatre roues doivent avoir le même diamètre.");
    }

    return new Car(parts.id, model, [...parts.wheels], parts.steeringWheel, parts.engine);
  }

  /** Démarre le moteur. */
  start(): Car {
    return new Car(this.id, this.model, this.wheels, this.steeringWheel, this.engine.start());
  }

  /** Tourne le volant ; refusé moteur à l'arrêt. */
  turn(degrees: number): Car {
    if (!this.engine.running) throw new InvalidCarError("Démarrez le moteur avant de tourner le volant.");
    return new Car(this.id, this.model, this.wheels, this.steeringWheel.turn(degrees), this.engine);
  }

  /** Une phrase qui résume la voiture (utile pour un affichage simple). */
  describe(): string {
    const diameter = this.wheels[0]?.diameterInches;
    const state = this.engine.running ? "moteur en marche" : "moteur à l'arrêt";
    return `${this.model} : 4 roues de ${diameter} pouces, un volant (${this.steeringWheel.direction}), un moteur de ${this.engine.powerHp} ch (${state}).`;
  }
}
