import { makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository";
import { afterAll, beforeEach, describe, expect, test } from "vitest";
import { createTodoUseCase } from "./create-todo.usecase";
import {
  InvalidTodo,
  TodoPresenter,
  ValidTodo,
} from "../schemas/todo.contract";

describe("createTodoUseCase (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  test("should create a new todo", async () => {
    const description = "abcd";
    const expectedResult: TodoPresenter = {
      success: true,
      todo: {
        id: expect.any(String),
        description,
        createdAt: expect.any(String),
      },
    };

    const result = (await createTodoUseCase(description)) as ValidTodo;

    expect(result).toStrictEqual(expectedResult);
  });

  test("should not create a todo if validation fails", async () => {
    const description = "abc";

    const result = (await createTodoUseCase(description)) as InvalidTodo;

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
