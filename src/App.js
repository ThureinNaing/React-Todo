import "./reset.css";
import "./App.css";
import TodoForm from "./components/TodoForm.js";
import CheckAllAndRemaining from "./components/CheckAllAndRemaining.js";
import TodoList from "./components/TodoList.js";
import TodoFilter from "./components/TodoFilter.js";
import ClearCompletedBtn from "./components/ClearCompletedBtn.js";
import { useCallback, useEffect, useState } from "react";

function App() {
  //assign for todos
  let [todos, setTodos] = useState([]);
  //for filter todos
  let [filteredTodos, setFilterTodos] = useState(todos);
  //fetch api
  useEffect(() => {
    fetch("http://localhost:3001/todos")
      .then((res) => res.json())
      .then((todos) => {
        setTodos(todos);
        setFilterTodos(todos);
      });
  }, []);

  //filter todos
  let filterBy = useCallback(
    (filter) => {
      if (filter === "All") {
        setFilterTodos(todos);
      }
      if (filter === "Active") {
        setFilterTodos(todos.filter((t) => !t.completed));
      }
      if (filter === "Completed") {
        setFilterTodos(todos.filter((t) => t.completed));
      }
    },
    [todos]
  );

  // add todo function
  let addTodo = (todo) => {
    //update data at server side
    fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    //update data at client side
    setTodos((prevState) => [...prevState, todo]);
  };

  //delete todo function
  let deleteTodo = (todoId) => {
    //server
    fetch(`http://localhost:3001/todos/${todoId}`, {
      method: "DELETE",
      cache: "no-cache",
    });
    //client
    setTodos((prevState) => {
      return prevState.filter((todo) => {
        return todo.id !== todoId;
      }); // [todo,todo]
    });
  };

  // update todo function
  let updateTodo = (todo) => {
    //update data at server
    fetch(`http://localhost:3001/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    //client
    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id === todo.id) {
          return todo;
        }
        return t;
      }); // [updateTodo,todo]
    });
  };

  //remaining count
  let remainingCount = todos.filter((t) => !t.completed).length;

  //Check all btn
  let checkAll = () => {
    //server side
    todos.forEach((t) => {
      t.completed = true;
      updateTodo(t);
    });

    //client side
    setTodos((prevState) => {
      return prevState.map((t) => {
        return { ...t, completed: true };
      });
    });
  };
  // clear completed btn
  let clearCompleted = () => {
    //server side
    todos.forEach((t) => {
      if (t.completed) {
        deleteTodo(t.id);
      }
    });
    //client side
    setTodos((prevState) => {
      return prevState.filter((t) => !t.completed);
    });
  };
  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
        <CheckAllAndRemaining
          remainingCount={remainingCount}
          checkAll={checkAll}
        />
        <div className="other-buttons-container">
          <TodoFilter filterBy={filterBy} />
          <ClearCompletedBtn clearCompleted={clearCompleted} />
        </div>
      </div>
    </div>
  );
}

export default App;
