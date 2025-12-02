import { describe, expect, test } from "vitest";
import {
  ValidateTodoDescription,
  validateTodoDescription,
} from "./validate-todo-description";

describe("validateTodoDescription (unit)", () => {
  test("should return errors when description todo is minus than 4", () => {
    // Arrange
    const description = "abc";

    // Act
    const expectedResult: ValidateTodoDescription = {
      success: false,
      errors: ["A descrição deve ter mais de 3 caracteres."],
    };

    // Assert
    expect(expectedResult).toStrictEqual(validateTodoDescription(description));
  });

  test("should return success when description todo is more than 3", () => {
    // Arrange
    const description = "abcd";

    // Act
    const expectedResult: ValidateTodoDescription = {
      success: true,
      errors: [],
    };

    // Assert
    expect(expectedResult).toStrictEqual(validateTodoDescription(description));
  });
});
