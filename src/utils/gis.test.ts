import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGeoJsonPolygon,
  calculatePolygonAreaSqMeters,
  sqMetersToUnits,
  convertTraditionalAreaToAcres,
} from './gis.ts';

test('validateGeoJsonPolygon identifies valid closed polygon', () => {
  const validPoly = {
    type: 'Polygon',
    coordinates: [
      [
        [85.83, 20.24],
        [85.84, 20.24],
        [85.84, 20.25],
        [85.83, 20.25],
        [85.83, 20.24],
      ],
    ],
  };
  const res = validateGeoJsonPolygon(validPoly);
  assert.equal(res.isValid, true);
});

test('validateGeoJsonPolygon detects unclosed polygon ring', () => {
  const unclosed = {
    type: 'Polygon',
    coordinates: [
      [
        [85.83, 20.24],
        [85.84, 20.24],
        [85.84, 20.25],
        [85.83, 20.25],
      ],
    ],
  };
  const res = validateGeoJsonPolygon(unclosed);
  assert.equal(res.isValid, false);
  assert.match(res.error || '', /first and last coordinates must match/i);
});

test('calculatePolygonAreaSqMeters calculates non-zero positive area', () => {
  const squareCoords: [number, number][] = [
    [85.83, 20.24],
    [85.84, 20.24],
    [85.84, 20.25],
    [85.83, 20.25],
    [85.83, 20.24],
  ];
  const sqMeters = calculatePolygonAreaSqMeters(squareCoords);
  assert.ok(sqMeters > 500000); // roughly ~1.1 sq km box
  const units = sqMetersToUnits(sqMeters);
  assert.ok(units.acres > 100);
  assert.ok(units.hectares > 50);
});

test('convertTraditionalAreaToAcres converts Gunthas and Manas accurately', () => {
  assert.equal(convertTraditionalAreaToAcres(25, 'Guntha'), 1.0);
  assert.equal(convertTraditionalAreaToAcres(50, 'Guntha'), 2.0);
  assert.equal(convertTraditionalAreaToAcres(2, 'Mana'), 2.0);
  assert.equal(convertTraditionalAreaToAcres(100, 'Decimal'), 1.0);
});
