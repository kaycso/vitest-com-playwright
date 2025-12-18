import { describe, expect, test, vi } from "vitest";
import * as createTodoUseCaseModule from "../usecases/create-todo.usecase";
import { InvalidTodo, ValidTodo } from "../schemas/todo.contract";
import { revalidatePath } from "next/cache";
import { createTodoAction } from "./create-todo.action";

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
  };
});

function makeMocks() {
  const correctDescription = "any correct description";
  const incorrectDescription = "any";

  const sucessResult: ValidTodo = {
    success: true,
    todo: {
      id: "id",
      description: correctDescription,
      createdAt: new Date().toISOString(),
    },
  };

  const failureResult: InvalidTodo = {
    success: false,
    errors: ["any", "errors"],
  };

  const createTodoUseCaseSpy = vi.spyOn(
    createTodoUseCaseModule,
    "createTodoUseCase"
  );

  const revalidatePathMocked = vi.mocked(revalidatePath);

  return {
    sucessResult,
    failureResult,
    createTodoUseCaseSpy,
    revalidatePathMocked,
    correctDescription,
    incorrectDescription,
  };
}

describe("createTodoAction (unit)", () => {
  test("should call createTodoUseCase with correct params", async () => {
    const { createTodoUseCaseSpy, sucessResult, correctDescription } =
      makeMocks();
    createTodoUseCaseSpy.mockResolvedValueOnce(sucessResult);

    await createTodoAction(correctDescription);

    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(
      correctDescription
    );
  });

  test("should revalidate path '/' on success", async () => {
    const {
      createTodoUseCaseSpy,
      revalidatePathMocked,
      sucessResult,
      correctDescription,
    } = makeMocks();
    createTodoUseCaseSpy.mockResolvedValueOnce(sucessResult);

    await createTodoAction(correctDescription);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith("/");
  });

  test("should not revalidate path '/' on failure", async () => {
    const {
      createTodoUseCaseSpy,
      revalidatePathMocked,
      failureResult,
      incorrectDescription,
    } = makeMocks();
    createTodoUseCaseSpy.mockResolvedValueOnce(failureResult);

    await createTodoAction(incorrectDescription);

    expect(revalidatePathMocked).not.toHaveBeenCalled();
  });

  test("should return the same as createTodoUseCase", async () => {
    const {
      createTodoUseCaseSpy,
      sucessResult,
      failureResult,
      correctDescription,
      incorrectDescription,
    } = makeMocks();
    createTodoUseCaseSpy
      .mockResolvedValueOnce(sucessResult)
      .mockResolvedValueOnce(failureResult);

    const successResponse = await createTodoAction(correctDescription);
    const failureResponse = await createTodoAction(incorrectDescription);

    expect(successResponse).toStrictEqual(sucessResult);
    expect(failureResponse).toStrictEqual(failureResult);
  });
});
