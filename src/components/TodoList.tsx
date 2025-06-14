import React, { useState, useEffect } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import { Plus } from 'lucide-react';

type Filter = 'all' | 'active' | 'completed';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNewTodoText('');
  };

  const toggleComplete = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
        My Todo List
      </h1>

      <form onSubmit={addTodo} className="flex mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-grow p-4 text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-l-lg"
          aria-label="New todo text"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-4 text-lg font-semibold rounded-r-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Add todo"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2 rounded-full text-lg font-medium transition-all duration-200 ${
            filter === 'all'
              ? 'bg-white text-blue-700 shadow-md'
              : 'bg-white/30 text-white hover:bg-white/50'
          }`}
        >
          All ({todos.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-5 py-2 rounded-full text-lg font-medium transition-all duration-200 ${
            filter === 'active'
              ? 'bg-white text-blue-700 shadow-md'
              : 'bg-white/30 text-white hover:bg-white/50'
          }`}
        >
          Active ({activeTodosCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-5 py-2 rounded-full text-lg font-medium transition-all duration-200 ${
            filter === 'completed'
              ? 'bg-white text-blue-700 shadow-md'
              : 'bg-white/30 text-white hover:bg-white/50'
          }`}
        >
          Completed ({completedTodosCount})
        </button>
      </div>

      <div className="space-y-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={toggleComplete}
              onDelete={deleteTodo}
            />
          ))
        ) : (
          <p className="text-center text-white text-lg italic mt-8">
            {filter === 'all' && "No tasks yet. Add one above!"}
            {filter === 'active' && "No active tasks."}
            {filter === 'completed' && "No completed tasks."}
          </p>
        )}
      </div>
    </div>
  );
};

export default TodoList;
