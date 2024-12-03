import React, { useState } from "react";
import DynamicForm from "./components/DynamicForm";
import DataTable from "./components/DataTable";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [formData, setFormData] = useState({
    user: [],
    address: [],
    payment: [],
  });

  const handleFormSubmit = (type, data) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], data],
    }));
  };

  const handleEdit = (type, index, updatedData) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? updatedData : item)),
    }));
  };

  const handleDelete = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mt-5">
      <DynamicForm onSubmit={handleFormSubmit} />
      {Object.entries(formData).map(
        ([type, data]) =>
          data.length > 0 && (
            <DataTable
              key={type}
              title={`${type.charAt(0).toUpperCase() + type.slice(1)} Data`}
              data={data}
              onEdit={(index, updatedData) => handleEdit(type, index, updatedData)}
              onDelete={(index) => handleDelete(type, index)}
            />
          )
      )}
    </div>
  );
};

export default App;
