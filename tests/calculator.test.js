// Jest tests for calculator evaluate() — ensures order of operations and math rules
beforeAll(() => {
  document.body.innerHTML = '<div id="output"></div><div id="history"></div><div id="keys"></div>';
  require('../scripts/calculator.js');
});

describe('Calculator evaluate()', () => {
  test('multiplication before addition', () => {
    expect(window.calc.evaluate('2+3*4')).toBe(14);
  });

  test('parentheses override precedence', () => {
    expect(window.calc.evaluate('(2+3)*4')).toBe(20);
  });

  test('exponent is right-associative', () => {
    expect(window.calc.evaluate('2^3^2')).toBe(512);
  });

  test('exponent with multiplication', () => {
    expect(window.calc.evaluate('2^3*2')).toBe(16);
  });

  test('sqrt and functions', () => {
    expect(window.calc.evaluate('sqrt(9)')).toBe(3);
  });

  test('sin(pi/2) approximately 1', () => {
    expect(window.calc.evaluate('sin(pi/2)')).toBeCloseTo(1, 9);
  });

  test('modulo and decimals combined', () => {
    expect(window.calc.evaluate('7%4 + 3.5*2')).toBe(10);
  });

  test('division by zero returns Error', () => {
    expect(window.calc.evaluate('1/0')).toBe('Error');
  });
});
