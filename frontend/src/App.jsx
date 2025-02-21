import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [ipvalue, setipvalue] = useState("");
  const [lists, setlists] = useState([]);
  const [editid, seteditid] = useState(null);

  const impkey = import.meta.env.VITE_IMP_KEY

  const getdata = async () => {
    try {
      const response = await fetch("http://localhost:5000/");
      const result = await response.json();
      if (result.status === 200) {
        setlists(result.data);
        console.log(result.data);
      } else {
        console.error("Error fetching data:", result);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const postdata = async () => {
    if (!ipvalue.trim()) {
      alert("Input cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipvalue }),
      });
      if (response.ok) {
        setipvalue("");
        getdata();
      } else {
        console.error("Error posting data:", response);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const putdata = async (index) => {
    if (!ipvalue.trim()) {
      alert("Input cannot be empty");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/?index=${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipvalue }),
      });
      if (response.ok) {
        seteditid(null);
        setipvalue("");
        getdata();
      } else {
        console.error("Error updating data:", response);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const deletedata = async (index) => {
    try {
      await fetch(`http://localhost:5000/${index}`, {
        method: "DELETE",
      });
      getdata();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <div className="container">
      <h1>TODO LISTS</h1>
        <input
          value={ipvalue}
          onChange={(e) => setipvalue(e.target.value)}
          type="text"
        />
        {editid !== null ? (
          <button onClick={() => putdata(editid)} className="edit">Update</button>
        ) : (
          <button onClick={postdata}>Add</button>
        )}
      </div>
      <ul>
        {lists.map((item) => (
          <li key={item._id}>
            {item.ipvalue} 
            <button onClick={() => { seteditid(item._id); setipvalue(item.ipvalue) }} className="edit">Edit</button> 
            <button onClick={() => deletedata(item._id)} className="delete">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
