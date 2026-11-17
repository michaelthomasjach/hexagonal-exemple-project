/**
 * COUCHE : APPLICATION — CAS D'USAGE
 *
 * Rôle du fichier : l'IMPLÉMENTATION du port entrant `BuildCarUseCase`. Il orchestre la construction :
 *   1. demander un identifiant au port sortant `IdGenerator` ;
 *   2. fabriquer les pièces (4 roues, 1 volant, 1 moteur) avec les règles du domaine ;
 *   3. assembler la voiture (le domaine vérifie la cohérence) ;
 *   4. l'enregistrer par le port sortant `CarRepository` ;
 *   5. renvoyer une vue (DTO) à l'appelant.
 *
 * Ce service ne contient PAS de règle métier (elles sont dans le domaine) et ne connaît AUCUNE technologie : il ne
 * reçoit que des interfaces dans son constructeur (« injection de dépendances »). C'est `main.ts` qui choisit les
 * implémentations concrètes à lui donner.
 */
import { Car } from "../../domain/model/Car.js";
import { Engine } from "../../domain/model/Engine.js";
import { SteeringWheel } from "../../domain/model/SteeringWheel.js";
import { WHEEL_POSITIONS, Wheel } from "../../domain/model/Wheel.js";
import { toCarView, type CarView } from "../dto/CarView.js";
import type { BuildCarCommand, BuildCarUseCase } from "../ports/in/BuildCarUseCase.js";
import type { CarRepository } from "../ports/out/CarRepository.js";
import type { IdGenerator } from "../ports/out/IdGenerator.js";

export class BuildCarService implements BuildCarUseCase {
  constructor(
    private readonly cars: CarRepository,
    private readonly ids: IdGenerator,
  ) {}

  async build(command: BuildCarCommand): Promise<CarView> {
    const car = Car.assemble({
      id: this.ids.next(),
      model: command.model,
      wheels: WHEEL_POSITIONS.map((position) => Wheel.create(position, command.wheelDiameterInches)),
      steeringWheel: SteeringWheel.centered(),
      engine: Engine.create(command.enginePowerHp),
    });
    await this.cars.save(car);
    return toCarView(car);
  }
}
