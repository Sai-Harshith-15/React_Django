import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);

  //new data
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      console.log(data);
      setBooks(data);
    } catch (e) {
      console.log("Error fetching books:", e);
    }
  };

  const addBook = async () => {
    const bookData = {
      title,
      release_year: releaseYear,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      console.log(data);
      // fetchBooks();
      setBooks((prev) => [...prev, data]);
    } catch (e) {
      console.log("Error creating book: " + e);
    }
  };
  //update title
  const updateTitle = async (pk, release_year) => {
    const bookData = {
      title: newTitle,
      release_year,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      console.log(data);
      // fetchBooks();
      // setBooks((prev) => [...prev, data]);
      setBooks((prev) =>
        prev.map((book) => {
          if (book.id == pk) {
            return data;
          } else {
            return book;
          }
        })
      );
    } catch (e) {
      console.log("Error updating book: " + e);
    }
  };

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "DELETE",
      });
      // await response.json();
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (e) {
      console.log("Error deleting book: " + e);
    }
  };

  return (
    <>
      <h1>Demo</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release Year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button onClick={addBook}>Add Book</button>
      </div>
      {books.map((book) => (
        <div key={book.id}>
          <p>Title: {book.title}</p>
          <p>Release Year: {book.release_year}</p>
          <input
            type="text"
            placeholder="New Title"
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={() => updateTitle(book.id, book.release_year)}>
            Change Title
          </button>
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}

export default App;
