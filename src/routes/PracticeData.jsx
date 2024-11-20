import React, { useEffect, useState } from "react";
import { createDocument, readDocument, readAllDocuments, updateDocument, deleteDocument } from '../crudOperations'

const FirestoreExample = () => {
  const [users, setUsers] = useState([]);
  const [singleUser, setSingleUser] = useState(null);

  console.log("users", singleUser);
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await readAllDocuments("users");
      setUsers(data);
    };

    fetchUsers();
  }, []);



  // Fetch a single user by ID
  const fetchSingleUser = async () => {
    const user = await readDocument("users", "mNkiEl1QWQ2T8EfkVlVk");
    setSingleUser(user);
  };

  // Add a new user
  const addUser = async () => {
    const newUserId = await createDocument("users", {
      name: "John Doe",
      email: "john@example.com",
      age: 25,
    });
    console.log("New User ID:", newUserId);
  };

  // Update a user
  const updateUser = async () => {
    await updateDocument("users", "2ZlKU8844jSUCSEjlGkm", { age: 26 });
    console.log("User updated!");
  };

  // Delete a user
  const deleteUser = async () => {
    await deleteDocument("users", "2ZlKU8844jSUCSEjlGkm");
    console.log("User deleted!");
  };

  return (
    <div className="m-20">
      <h1>Firestore Example</h1>

      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.age})</li>
        ))}
      </ul>

      <h2>Single User</h2>
      <button onClick={fetchSingleUser}>Fetch Single User</button>
      {singleUser && (
        <div>
          <p>Name: {singleUser.name}</p>
          <p>Email: {singleUser.email}</p>
          <p>Age: {singleUser.age}</p>
        </div>
      )}

      <button onClick={addUser}>Add User</button>
      <button onClick={updateUser}>Update User</button>
      <button onClick={deleteUser}>Delete User</button>
    </div>
  );
};

export default FirestoreExample;
