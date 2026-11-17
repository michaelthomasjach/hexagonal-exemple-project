/**
 * COUCHE : APPLICATION
 *
 * Rôle du fichier : la « vue » d'une voiture renvoyée par les cas d'usage (un DTO, Data Transfer Object).
 *
 * Pourquoi ne pas renvoyer directement l'objet `Car` du domaine ? Pour que l'extérieur (ligne de commande, API…)
 * ne dépende pas des classes du domaine et ne puisse pas appeler leurs méthodes. Le DTO est un simple objet de
 * données, facile à afficher ou à convertir en JSON. Si le domaine évolue, seule la fonction `toCarView` change.
 */
import type { Car } from "../../domain/model/Car.js";

export interface CarView {
  id: string;
  model: string;
  wheelCount: number;
  wheelDiameterInches: number;
  steeringAngleDegrees: number;
  enginePowerHp: number;
  engineRunning: boolean;
  summary: string;
}

/** Convertit une voiture du domaine en vue publique. */
export function toCarView(car: Car): CarView {
  return {
    id: car.id,
    model: car.model,
    wheelCount: car.wheels.length,
    wheelDiameterInches: car.wheels[0]?.diameterInches ?? 0,
    steeringAngleDegrees: car.steeringWheel.angleDegrees,
    enginePowerHp: car.engine.powerHp,
    engineRunning: car.engine.running,
    summary: car.describe(),
  };
}
