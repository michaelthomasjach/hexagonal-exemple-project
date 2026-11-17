/**
 * COUCHE : ADAPTATEURS — ADAPTATEUR ENTRANT (« driving adapter »)
 *
 * Rôle du fichier : la LIGNE DE COMMANDE. Elle traduit ce que tape l'utilisateur en appels aux ports entrants
 * (`BuildCarUseCase`, `DriveCarUseCase`), puis traduit les réponses (et les erreurs) en texte à l'écran.
 *
 * Un adaptateur entrant ne contient aucune règle métier. Son travail :
 *   - lire et convertir l'entrée (ici des arguments `--modele`, `--diametre`, `--puissance`, `--virage`) ;
 *   - appeler le cas d'usage ;
 *   - présenter le résultat dans SON format (du texte ; une API HTTP renverrait du JSON et un code de statut).
 *
 * Il ne connaît que les INTERFACES des ports, jamais les classes `BuildCarService` / `DriveCarService` : on peut
 * donc le tester avec de faux cas d'usage, ou ajouter à côté un adaptateur HTTP qui réutilise les mêmes ports.
 */
import { CarNotFoundError } from "../../../application/errors/CarNotFoundError.js";
import type { BuildCarUseCase } from "../../../application/ports/in/BuildCarUseCase.js";
import type { DriveCarUseCase } from "../../../application/ports/in/DriveCarUseCase.js";
import { InvalidCarError } from "../../../domain/errors/InvalidCarError.js";

/** Où l'adaptateur écrit : la console en vrai, un tableau dans un test. */
export interface Output {
  log(line: string): void;
  error(line: string): void;
}

export class CarCliAdapter {
  constructor(
    private readonly buildCar: BuildCarUseCase,
    private readonly driveCar: DriveCarUseCase,
    private readonly out: Output = console,
  ) {}

  /**
   * Construit une voiture, démarre son moteur et tourne le volant.
   * Renvoie le code de sortie du programme : 0 si tout va bien, 1 en cas d'erreur.
   */
  async run(argv: string[]): Promise<number> {
    try {
      const args = parseArgs(argv);
      const built = await this.buildCar.build({
        model: args.get("modele") ?? "Voiture d'exemple",
        wheelDiameterInches: Number(args.get("diametre") ?? 17),
        enginePowerHp: Number(args.get("puissance") ?? 110),
      });
      this.out.log(`Voiture construite (${built.id}) : ${built.summary}`);

      const started = await this.driveCar.start(built.id);
      this.out.log(`Contact : ${started.summary}`);

      const turned = await this.driveCar.turn(built.id, Number(args.get("virage") ?? 90));
      this.out.log(`Volant tourné de ${turned.steeringAngleDegrees}° : ${turned.summary}`);
      return 0;
    } catch (error) {
      // Les erreurs connues (règles métier, voiture introuvable) deviennent un message clair ; les autres remontent.
      if (error instanceof InvalidCarError || error instanceof CarNotFoundError) {
        this.out.error(`Erreur : ${error.message}`);
        return 1;
      }
      throw error;
    }
  }
}

/** Lit des arguments de la forme `--nom valeur`. */
function parseArgs(argv: string[]): Map<string, string> {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key?.startsWith("--") && value !== undefined) {
      args.set(key.slice(2), value);
      i++;
    }
  }
  return args;
}
