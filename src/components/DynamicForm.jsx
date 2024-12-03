import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import DataTable from "./DataTable";

const DynamicForm = () => {
  const [formType, setFormType] = useState(
    localStorage.getItem("formType") || ""
  );
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState(
    JSON.parse(localStorage.getItem("submittedData")) || {
      user: [],
      address: [],
      payment: [],
    }
  );
  const [showTable, setShowTable] = useState(
    JSON.parse(localStorage.getItem("showTable")) || false
  );

  const formOptions = {
    user: {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    address: {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    payment: {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        {
          name: "cardholderName",
          type: "text",
          label: "Cardholder Name",
          required: true,
        },
      ],
    },
  };

  useEffect(() => {
    if (formType) {
      setFormFields(formOptions[formType]?.fields || []);
    }
  }, [formType]);

  useEffect(() => {
    localStorage.setItem("submittedData", JSON.stringify(submittedData));
    localStorage.setItem("showTable", JSON.stringify(showTable));
    localStorage.setItem("formType", formType);
  }, [submittedData, showTable, formType]);

  const handleFormTypeChange = (event) => {
    const selectedFormType = event.target.value;
    setFormType(selectedFormType);
    setFormFields(formOptions[selectedFormType]?.fields || []);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData((prev) => {
      const updatedData = { ...prev };
      // Ensure the formType is properly initialized as an array
      if (!updatedData[formType]) {
        updatedData[formType] = [];
      }
      updatedData[formType].push(formData); // Add the formData to the correct formType
      return updatedData;
    });
    setFormData({});
    setShowTable(true);
  };

  const handleEdit = (type, index, updatedData) => {
    setSubmittedData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? updatedData : item)),
    }));
  };

  const handleDelete = (type, index) => {
    setSubmittedData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return showTable ? (
    <div>
      <Button
        variant="dark"
        className="mb-3"
        onClick={() => setShowTable(false)}
      >
        Go Back
      </Button>
      {Object.entries(submittedData).map(([type, data]) =>
        data.length > 0 ? (
          <DataTable
            key={type}
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} Data`}
            data={data}
            onEdit={(index, updatedData) =>
              handleEdit(type, index, updatedData)
            }
            onDelete={(index) => handleDelete(type, index)}
          />
        ) : null
      )}
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "30vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <h1 className="text-center">Dynamic Form</h1>

        <Form.Group className="mb-3">
          <Form.Label>Select Form</Form.Label>
          <Form.Select onChange={handleFormTypeChange} value={formType}>
            <option value="">Choose...</option>
            <option value="user">User Information</option>
            <option value="address">Address Information</option>
            <option value="payment">Payment Information</option>
          </Form.Select>
        </Form.Group>

        {formType && (
          <>
            {formFields.map((field, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>{field.label}</Form.Label>
                {field.type === "dropdown" ? (
                  <Form.Select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    required={field.required}
                  >
                    <option value="">Select...</option>
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    required={field.required}
                  />
                )}
              </Form.Group>
            ))}
            <Button
              type="submit"
              variant="success"
              className="w-100"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
