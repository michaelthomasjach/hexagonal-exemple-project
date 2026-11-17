/**
 * TESTS DE L'APPLICATION
 *
 * Rôle du fichier : vérifier les cas d'usage en remplaçant les adaptateurs par des « doublures » de test.
 *
 * C'est ici que l'architecture hexagonale montre son intérêt : les services ne dépendent que d'interfaces (ports),
 * on peut donc leur donner une fausse implémentation écrite en trois lignes — un générateur d'identifiants qui
 * renvoie toujours la même valeur, un dépôt qui garde les voitures dans un tableau — et tester toute la logique
 * sans base de données ni réseau.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CarNotFoundError } from "../../src/application/errors/CarNotFoundError.js";
import type { CarRepository } from "../../src/application/ports/out/CarRepository.js";
import type { IdGenerator } from "../../src/application/ports/out/IdGenerator.js";
import { BuildCarService } from "../../src/application/use-cases/BuildCarService.js";
import { DriveCarService } from "../../src/application/use-cases/DriveCarService.js";
import { CarCliAdapter } from "../../src/adapters/in/cli/CarCliAdapter.js";
import type { Car } from "../../src/domain/model/Car.js";
import { InvalidCarError } from "../../src/domain/errors/InvalidCarError.js";

/** Doublure du port `IdGenerator` : toujours le même identifiant, pour des tests prévisibles. */
class FixedIdGenerator implements IdGenerator {
  next(): string {
    return "voiture-test";
  }
}

/** Doublure du port `CarRepository` : garde les voitures et compte les enregistrements. */
class SpyCarRepository implements CarRepository {
  readonly saved: Car[] = [];
  async save(car: Car): Promise<void> {
    this.saved.push(car);
  }
  async findById(id: string): Promise<Car | null> {
    return [...this.saved].reverse().find((c) => c.id === id) ?? null;
  }
}

describe("Construire et conduire une voiture (application)", () => {
  it("construit la voiture, l'enregistre par le port sortant et renvoie sa vue", async () => {
    const repo = new SpyCarRepository();
    const view = await new BuildCarService(repo, new FixedIdGenerator()).build({ model: "Berline", wheelDiameterInches: 18, enginePowerHp: 150 });
    assert.equal(view.id, "voiture-test");
    assert.equal(view.wheelCount, 4);
    assert.equal(view.enginePowerHp, 150);
    assert.equal(repo.saved.length, 1);
  });

  it("laisse passer les erreurs du domaine (règle métier violée)", async () => {
    const service = new BuildCarService(new SpyCarRepository(), new FixedIdGenerator());
    await assert.rejects(service.build({ model: "Berline", wheelDiameterInches: 40, enginePowerHp: 150 }), InvalidCarError);
  });

  it("démarre puis tourne le volant d'une voiture enregistrée ; refuse une voiture inconnue", async () => {
    const repo = new SpyCarRepository();
    await new BuildCarService(repo, new FixedIdGenerator()).build({ model: "Berline", wheelDiameterInches: 18, enginePowerHp: 150 });
    const drive = new DriveCarService(repo);
    await drive.start("voiture-test");
    const turned = await drive.turn("voiture-test", -45);
    assert.equal(turned.steeringAngleDegrees, -45);
    assert.equal(turned.engineRunning, true);
    await assert.rejects(drive.start("inconnue"), CarNotFoundError);
  });

  it("l'adaptateur ligne de commande affiche le résultat, et un message clair en cas d'erreur", async () => {
    const repo = new SpyCarRepository();
    const lines: string[] = [];
    const errors: string[] = [];
    const cli = new CarCliAdapter(new BuildCarService(repo, new FixedIdGenerator()), new DriveCarService(repo), {
      log: (l) => lines.push(l),
      error: (l) => errors.push(l),
    });
    assert.equal(await cli.run(["--modele", "Citadine", "--diametre", "16"]), 0);
    assert.equal(lines.length, 3);
    assert.equal(await cli.run(["--puissance", "0"]), 1);
    assert.match(errors[0] ?? "", /puissance/);
  });
});
