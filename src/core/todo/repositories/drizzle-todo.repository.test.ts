import { afterAll, beforeEach, describe, expect, test } from "vitest";
import {
  insertTestTodos,
  makeTestTodoRepository,
} from "@/core/__tests__/utils/make-test-todo-repository";
import { Todo } from "../schemas/todo.contract";

describe("DrizzleTodoRepository (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = await makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  describe("findAll", () => {
    test("should return all todos in descending order", async () => {
      // console.log("TESTE:", drizzleDatabase.db.$client.name);
      const { repository } = await makeTestTodoRepository();

      await insertTestTodos();

      const todos = await repository.findAll();
      const isDesc = todos.every((todo, index) => {
        if (index === 0) return true;
        return new Date(todo.createdAt) <= new Date(todos[index - 1].createdAt);
      });

      expect(isDesc).toBe(true);
    });

    test("should return an empty array if there are no todos", async () => {
      const { repository } = await makeTestTodoRepository();

      const todos = await repository.findAll();

      expect(todos).toStrictEqual([]);
    });
  });

  describe("create", () => {
    test("should create a new todo", async () => {
      const { repository } = await makeTestTodoRepository();
      const todo: Todo = {
        id: "1",
        description: "Todo 1",
        createdAt: new Date().toISOString(),
      };
      const expectedResult = {
        success: true,
        todo,
      };

      const result = await repository.create(todo);

      expect(result).toStrictEqual(expectedResult);
    });

    test("should throw an error if the description is invalid", () => {});

    test("should throw an error if the description is too long", () => {});

    test("should throw an error if the description is too short", () => {});

    test("should throw an error if the description is empty", () => {});

    test("should throw an error if the description is null", () => {});

    test("should throw an error if the description is undefined", () => {});

    test("should throw an error if the descriptions exist in the database", () => {});
  });

  describe("remove", () => {
    test("should remove a todo", () => {});

    test("should throw an error if the todo does not exist", () => {});
  });
});
