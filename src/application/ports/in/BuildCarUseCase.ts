/**
 * COUCHE : APPLICATION — PORT ENTRANT (aussi appelé « port primaire » ou « driving port »)
 *
 * Rôle du fichier : l'INTERFACE qui décrit ce que l'application sait faire vu de l'extérieur : « construire une
 * voiture ». C'est la porte d'entrée de l'hexagone.
 *
 * Pourquoi une interface ? Les adaptateurs entrants (la ligne de commande aujourd'hui, une API HTTP ou une interface
 * graphique demain) appellent CETTE interface, jamais la classe qui l'implémente. On peut donc remplacer
 * l'implémentation, ou la simuler dans un test, sans toucher aux adaptateurs.
 *
 * L'implémentation se trouve dans `application/use-cases/BuildCarService.ts`.
 */
import type { CarView } from "../../dto/CarView.js";

/** La demande de construction : ce que l'utilisateur choisit. */
export interface BuildCarCommand {
  model: string;
  wheelDiameterInches: number;
  enginePowerHp: number;
}

export interface BuildCarUseCase {
  /** Construit une voiture (4 roues, 1 volant, 1 moteur), l'enregistre et renvoie sa vue. */
  build(command: BuildCarCommand): Promise<CarView>;
}
