import { describe, expect, test } from "vitest";
import { makeNewTodo } from "./make-new-todo";

describe("makeNewTodo (unit)", () => {
  test("should create a new todo with the given description", () => {
    // Padrão AAA (Arrange, Act, Assert)
    // Arrange -> Criar as coisas que eu preciso
    const description = "Novo todo";

    const expectedTodo = {
      id: expect.any(String),
      description,
      createdAt: expect.any(String),
    };

    // Act -> Executar a ação que eu quero testar
    const newTodo = makeNewTodo(description);

    // Assert -> Verificar se o resultado é o esperado
    expect(newTodo.description).toBe(expectedTodo.description);
    expect(newTodo).toStrictEqual(expectedTodo);
  });
});
