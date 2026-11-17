/**
 * COUCHE : APPLICATION — CAS D'USAGE
 *
 * Rôle du fichier : l'IMPLÉMENTATION du port entrant `DriveCarUseCase` (démarrer, tourner le volant).
 *
 * Le schéma est toujours le même pour un cas d'usage qui modifie un agrégat :
 *   charger (port sortant) → demander au domaine de faire l'action → enregistrer (port sortant) → renvoyer une vue.
 * La règle « on ne tourne pas moteur arrêté » n'est pas écrite ici : c'est la voiture (domaine) qui la fait
 * respecter. Le service se contente de coordonner.
 */
import type { Car } from "../../domain/model/Car.js";
import { CarNotFoundError } from "../errors/CarNotFoundError.js";
import { toCarView, type CarView } from "../dto/CarView.js";
import type { DriveCarUseCase } from "../ports/in/DriveCarUseCase.js";
import type { CarRepository } from "../ports/out/CarRepository.js";

export class DriveCarService implements DriveCarUseCase {
  constructor(private readonly cars: CarRepository) {}

  async start(carId: string): Promise<CarView> {
    return this.update(carId, (car) => car.start());
  }

  async turn(carId: string, degrees: number): Promise<CarView> {
    return this.update(carId, (car) => car.turn(degrees));
  }

  /** Charge la voiture, applique l'action du domaine, enregistre le résultat. */
  private async update(carId: string, action: (car: Car) => Car): Promise<CarView> {
    const car = await this.cars.findById(carId);
    if (!car) throw new CarNotFoundError(carId);
    const next = action(car);
    await this.cars.save(next);
    return toCarView(next);
  }
}
