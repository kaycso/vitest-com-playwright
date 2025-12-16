import { makeValidatedTodo } from "../factories/make-validated-todo";
import { todoRepository } from "../repositories/default.repository";
import { TodoPresenter } from "../schemas/todo.contract";

export async function createTodoUseCase(
  description: string
): Promise<TodoPresenter> {
  const validateTodo = makeValidatedTodo(description);

  if (!validateTodo.success) {
    return validateTodo;
  }

  const createResult = await todoRepository.create(validateTodo.todo);

  return createResult;
}
