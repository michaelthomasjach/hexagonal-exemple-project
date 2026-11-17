/**
 * COUCHE : ADAPTATEURS — ADAPTATEUR SORTANT (« driven adapter »)
 *
 * Rôle du fichier : une IMPLÉMENTATION du port sortant `CarRepository`, qui garde les voitures en mémoire (dans une
 * `Map`). Elles disparaissent quand le programme s'arrête : c'est voulu, l'exemple reste sans base de données.
 *
 * Pour passer à une vraie base (PostgreSQL, MongoDB, un fichier JSON…), on écrirait un autre adaptateur, par exemple
 * `PostgresCarRepository implements CarRepository`, et on le brancherait dans `main.ts`. Le domaine et les cas
 * d'usage ne changeraient pas d'une ligne : c'est la promesse de l'architecture hexagonale.
 *
 * Un adaptateur dépend de l'application (il implémente son interface) ; l'application ne dépend jamais de lui.
 */
import type { CarRepository } from "../../../application/ports/out/CarRepository.js";
import type { Car } from "../../../domain/model/Car.js";

export class InMemoryCarRepository implements CarRepository {
  private readonly cars = new Map<string, Car>();

  async save(car: Car): Promise<void> {
    this.cars.set(car.id, car);
  }

  async findById(id: string): Promise<Car | null> {
    return this.cars.get(id) ?? null;
  }
}
