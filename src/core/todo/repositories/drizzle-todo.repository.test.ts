import { afterAll, beforeEach, describe, expect, test } from "vitest";
import {
  insertTestTodos,
  makeTestTodo,
  makeTestTodoRepository,
} from "@/core/__tests__/utils/make-test-todo-repository";

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
      const todo = makeTestTodo();
      const expectedResult = {
        success: true,
        todo,
      };

      const result = await repository.create(todo);

      expect(result).toStrictEqual(expectedResult);
    });

    test.each([null, undefined])(
      "should not create a todo if the description is invalid (null, undefined)",
      async (invalidDescription) => {
        const { repository } = await makeTestTodoRepository();
        const todo = makeTestTodo();
        // @ts-expect-error erro esperado para validação
        todo.description = invalidDescription;

        const tryCreateNewTodo = repository.create(todo);

        await expect(tryCreateNewTodo).rejects.toThrowError();
      }
    );

    test("should not create a todo if the description or id already exists", async () => {
      const { repository } = await makeTestTodoRepository();
      const todo = makeTestTodo();
      const expectedResult = {
        success: false,
        errors: ["Já existe um todo com id ou descrição enviado"],
      };

      await repository.create(todo);
      const createdWithSameDescription = await repository.create({
        id: "new Id",
        description: todo.description,
        createdAt: new Date().toISOString(),
      });
      const createdWithSameId = await repository.create({
        id: todo.id,
        description: "new description",
        createdAt: new Date().toISOString(),
      });

      expect(createdWithSameDescription).toStrictEqual(expectedResult);
      expect(createdWithSameId).toStrictEqual(expectedResult);
    });
  });

  describe("remove", () => {
    test("should remove a todo", async () => {
      const { repository } = await makeTestTodoRepository();
      const [todo] = await insertTestTodos();
      const expectedResult = {
        success: true,
        todo,
      };

      const result = await repository.remove(todo.id);

      expect(result).toStrictEqual(expectedResult);
    });

    test("should throw an error if the todo does not exist", async () => {
      const { repository } = await makeTestTodoRepository();
      const todo = makeTestTodo();
      const expectedResult = {
        success: false,
        errors: ["Todo não encontrado"],
      };

      const result = await repository.remove(todo.id);

      expect(result).toStrictEqual(expectedResult);
    });
  });
});
