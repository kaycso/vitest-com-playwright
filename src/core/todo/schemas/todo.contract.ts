export type Todo = {
  id: string;
  description: string;
  createdAt: string;
};

type InvalidTodo = {
  success: boolean;
  errors: string[];
};

type ValidTodo = {
  success: boolean;
  todo: Todo;
};

export type TodoPresenter = ValidTodo | InvalidTodo;
