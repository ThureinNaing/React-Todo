import React from "react";
import { useState } from "react";

export default function TodoForm({ addTodo }) {
  // assign for input value
  let [title, setTitle] = useState("");
  //submit button function
  let handleSubmit = (e) => {
    //handle the page refresh
    e.preventDefault();
    //add todo object
    let todo = {
      id: Math.random().toString(),
      title: title,
      completed: false,
    };
    //add todo function
    addTodo(todo);
    //clear
    setTitle(" ");
  };
  return (
    <form action="#" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="What do you need to do?"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
    </form>
  );
}
