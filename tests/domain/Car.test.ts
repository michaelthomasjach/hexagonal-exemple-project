/**
 * TESTS DU DOMAINE
 *
 * Rôle du fichier : vérifier les règles métier de la voiture SANS aucune infrastructure. Pas de base de données, pas
 * de serveur, pas de faux objets : le domaine est du TypeScript pur, donc ses tests sont simples et instantanés.
 *
 * Lancer : `npm test` (exécuteur de tests intégré à Node.js, `node:test`).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InvalidCarError } from "../../src/domain/errors/InvalidCarError.js";
import { Car } from "../../src/domain/model/Car.js";
import { Engine } from "../../src/domain/model/Engine.js";
import { SteeringWheel } from "../../src/domain/model/SteeringWheel.js";
import { WHEEL_POSITIONS, Wheel } from "../../src/domain/model/Wheel.js";

const fourWheels = (diameter = 17) => WHEEL_POSITIONS.map((p) => Wheel.create(p, diameter));
const parts = () => ({ id: "voiture-1", model: "Citadine", wheels: fourWheels(), steeringWheel: SteeringWheel.centered(), engine: Engine.create(90) });

describe("Voiture (domaine)", () => {
  it("s'assemble avec 4 roues, un volant et un moteur", () => {
    const car = Car.assemble(parts());
    assert.equal(car.wheels.length, 4);
    assert.equal(car.engine.running, false);
    assert.match(car.describe(), /4 roues de 17 pouces/);
  });

  it("refuse 3 roues, ou deux roues au même coin", () => {
    assert.throws(() => Car.assemble({ ...parts(), wheels: fourWheels().slice(0, 3) }), InvalidCarError);
    const sameCorner = [...fourWheels().slice(0, 3), Wheel.create("avant-gauche", 17)];
    assert.throws(() => Car.assemble({ ...parts(), wheels: sameCorner }), InvalidCarError);
  });

  it("refuse une roue hors des diamètres possibles et un moteur sans puissance", () => {
    assert.throws(() => Wheel.create("avant-gauche", 30), InvalidCarError);
    assert.throws(() => Engine.create(0), InvalidCarError);
  });

  it("ne tourne le volant que moteur démarré, et s'arrête à la butée", () => {
    const car = Car.assemble(parts());
    assert.throws(() => car.turn(90), InvalidCarError);
    const turned = car.start().turn(1000);
    assert.equal(turned.steeringWheel.angleDegrees, SteeringWheel.MAX_ANGLE_DEGREES);
    assert.equal(turned.steeringWheel.direction, "à droite");
  });
});
