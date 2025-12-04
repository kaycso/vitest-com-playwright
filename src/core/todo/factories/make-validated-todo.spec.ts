import { describe, expect, test, vi } from "vitest";
import * as sanitizeStrModule from "@/utils/sanitize-str";
import * as validateTodoDescriptionModule from "@/core/todo/schemas/validate-todo-description";
import { makeValidatedTodo } from "./make-validated-todo";
import * as makeNewTodoModule from "./make-new-todo";

describe("makeValidatedTodo (unit)", () => {
  test("should make a valid todo", () => {
    // Arrange
    const {
      description,
      sanitizeStrSpy,
      validateTodoDescriptionSpy,
      makeNewTodoSpy,
      todo,
    } = makeMocks();

    validateTodoDescriptionSpy.mockReturnValue({ success: true, errors: [] });

    const expectedValidatedTodo = {
      success: true,
      data: {
        id: todo.id,
        description,
        createdAt: todo.createdAt,
      },
    };

    // Act
    const result = makeValidatedTodo(description);

    // Assert
    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description);
    expect(validateTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(
      description
    );
    expect(makeNewTodoSpy).toHaveBeenCalledExactlyOnceWith(description);
    expect(result).toStrictEqual(expectedValidatedTodo);
  });

  test("should return errors when validateTodoDescription fails", () => {
    // Arrange
    const {
      description,
      sanitizeStrSpy,
      makeNewTodoSpy,
      validateTodoDescriptionSpy,
    } = makeMocks("ab");

    const errors = ["Description is too short"];
    validateTodoDescriptionSpy.mockReturnValue({ success: false, errors });

    // Act
    const result = makeValidatedTodo(description);

    // Assert
    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(description);
    expect(validateTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(
      description
    );
    expect(makeNewTodoSpy).not.toHaveBeenCalled();
    expect(result).toStrictEqual({
      success: false,
      errors,
    });
  });
});

const makeMocks = (description: string = "abcd") => {
  const sanitizeStrSpy = vi
    .spyOn(sanitizeStrModule, "sanitizeStr")
    .mockReturnValue(description);

  const validateTodoDescriptionSpy = vi.spyOn(
    validateTodoDescriptionModule,
    "validateTodoDescription"
  );

  const todo = {
    id: "any-id",
    description,
    createdAt: new Date().toISOString(),
  };
  const makeNewTodoSpy = vi
    .spyOn(makeNewTodoModule, "makeNewTodo")
    .mockReturnValue(todo);

  return {
    description,
    sanitizeStrSpy,
    validateTodoDescriptionSpy,
    makeNewTodoSpy,
    todo,
  };
};
