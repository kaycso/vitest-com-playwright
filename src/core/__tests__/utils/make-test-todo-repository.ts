import { DrizzleTodoRepository } from "@/core/todo/repositories/drizzle-todo.repository";
import { Todo } from "@/core/todo/schemas/todo.contract";
import { drizzleDatabase } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export async function makeTestTodoRepository() {
  const { db, todoTable } = drizzleDatabase;

  const repository = new DrizzleTodoRepository(db);
  const insertTodoDb = () => db.insert(todoTable);
  const deleteTodoNoWhere = () => db.delete(todoTable);
  const deleteTodo = (id: string) =>
    db.delete(todoTable).where(eq(todoTable.id, id));

  return { repository, insertTodoDb, deleteTodoNoWhere, deleteTodo };
}

function makeTestTodos(): Todo[] {
  return Array.from({ length: 5 }).map((_, index) => {
    const newTodo = {
      id: `todo-${index}`,
      description: `Todo ${index}`,
      createdAt: new Date().toISOString(),
    };

    return newTodo;
  });
}

export async function insertTestTodos() {
  const { insertTodoDb } = await makeTestTodoRepository();
  const todos = makeTestTodos();

  await insertTodoDb().values(todos);

  return todos;
}
