import React, { useState } from "react";
// import { doc, updateDoc } from "firebase/firestore"; // Uncomment this for Firebase
// import { db } from "./firebaseConfig"; // Uncomment this for Firebase
import EditStackedList from "../molecules/stackedlist/EditStackedList";
import { ChevronLeftIcon } from "../icons/Icons";
import { Link } from "react-router-dom";

const ManageNotifications = () => {
  const [field1, setField1] = useState("Initial Value 1");
  const [field2, setField2] = useState("Initial Value 2");
  const [name, setName] = useState("John Doe");
  const [gender, setGender] = useState("male");
  const [notifications, setNotifications] = useState(true);
  const [toggleField, setToggleField] = useState(false);

console.log(field1, field2, name, gender, toggleField)

  const updateState = (fieldName, value) => {
    if (fieldName === "field1") setField1(value);
    if (fieldName === "field2") setField2(value);
    if (fieldName === "name") setName(value);
    if (fieldName === "gender") setGender(value);
    if (fieldName === "notifications") setNotifications(value);
    if (fieldName === "toggleField") setToggleField(value);
  };

  const saveChanges = async () => {
    // Replace this with actual Firestore logic in your application
    // Uncomment the following code for Firebase functionality:
    /*
    try {
      const docRef = doc(db, "collectionName", "docId");
      await updateDoc(docRef, {
        field1,
        field2,
        toggleField,
      });
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes: ", error);
      alert("Failed to save changes.");
    }
    */

    // For Storybook, we log to the console instead
    console.log("Saving changes:", { field1, field2, toggleField });
    alert("Changes saved! (Simulated for Storybook)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <div >
          <ChevronLeftIcon className='w-6 h-6'/>
        </div>
        <h1 className="ml-10 text-2xl">Manage Notifications</h1>
      </header>

      <main>
        <EditStackedList
          updateState={updateState}
          items={[
            {
              type: "EditableTextField",
              props: { name: "Name", fieldName: "field1", currentState: field1 },
            },
            {
              type: "SelectField",
              props: { name: "Category", fieldName: "field2", currentState: field2, options: ["Option 1", "Option 2", "Option 3"] },
            },
            {
              type: "ToggleField",
              props: { name: "Enable Feature", fieldName: "toggleField", value: toggleField },
            },
          ]}
        />
<EditStackedList
  title="Settings"
  items={[
    { type: "EditableTextField", props: { fieldName: "name", value: "John Doe" } },
    { type: "SelectField", props: { fieldName: "gender", options: ["Male", "Female"], value: "Male" } },
    { type: "ToggleField", props: { name: "Notifications", fieldName: "notifications", value: notifications } },
  ]}
  updateState={updateState}
/>
      </main>

      <footer style={{ marginTop: "20px" }}>
        <button onClick={saveChanges} style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "blue", color: "white" }}>
          Save Changes
        </button>
      </footer>
    </div>
  );
};

export default ManageNotifications;
