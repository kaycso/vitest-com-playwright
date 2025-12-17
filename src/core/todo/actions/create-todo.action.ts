import { revalidatePath } from "next/cache";
import { createTodoUseCase } from "../usecases/create-todo.usecase";

export async function createTodoAction(description: string) {
  "use server";

  const createdTodo = await createTodoUseCase(description);

  if (createdTodo.success) {
    revalidatePath("/");
  }

  return createdTodo;
}
