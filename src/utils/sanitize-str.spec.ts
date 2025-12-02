import { describe, expect, test } from "vitest";
import { sanitizeStr } from "./sanitize-str";

describe("sanitizeStr (unit)", () => {
  test("should trim and normalize a valid string", () => {
    // Arrange
    const input = "  Hello World!  ";
    const expectedOutput = "Hello World!";

    // Act
    const output = sanitizeStr(input);

    // Assert
    expect(output).toBe(expectedOutput);
  });

  test("should return an empty string for null or undefined input", () => {
    // Arrange
    const inputs = [null, undefined, ""];
    const expectedOutput = "";

    inputs.forEach((input) => {
      // Act
      // @ts-expect-error Testing invalid input
      const output = sanitizeStr(input);

      // Assert
      expect(output).toBe(expectedOutput);
    });
  });

  test("should return an empty string for non-string input", () => {
    // Arrange
    const inputs = [42, {}, [], true];
    const expectedOutput = "";

    inputs.forEach((input) => {
      // Act
      // @ts-expect-error Testing invalid input
      const output = sanitizeStr(input);

      // Assert
      if (output !== expectedOutput) {
        throw new Error(
          `Expected "${expectedOutput}", but got "${output}" for input ${input}`
        );
      }
    });
  });

  test("should normalize unicode characters", () => {
    // Arrange
    const input = "Cafe\u0301"; // 'é' can be represented in different unicode forms
    const expectedOutput = "Café";

    // Act
    const output = sanitizeStr(input);

    // Assert
    expect(output).toBe(expectedOutput);
  });
});
