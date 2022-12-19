import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>My App</h1>
      <p>Hello world!</p>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} time(s)
      </button>
    </div>
  );
}
