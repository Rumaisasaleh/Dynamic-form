import React, { useState } from 'react';
import { Form, ProgressBar, Button, Table, Alert, Container, Row, Col } from 'react-bootstrap';
import './App.css';

const App = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({
    'User Information': [],
    'Address Information': [],
    'Payment Information': [],
  });
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const formOptions = {
    'User Information': {
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName', type: 'text', label: 'Last Name', required: true },
        { name: 'age', type: 'number', label: 'Age', required: false },
      ],
    },
    'Address Information': {
      fields: [
        { name: 'street', type: 'text', label: 'Street', required: true },
        { name: 'city', type: 'text', label: 'City', required: true },
        { name: 'state', type: 'dropdown', label: 'State', options: ['Kerala', 'TamilNadu', 'Karnataka', 'Goa', 'Other'], required: true },
        { name: 'zipCode', type: 'number', label: 'Pin code', required: true },
      ],
    },
    'Payment Information': {
      fields: [
        { name: 'cardNumber', type: 'number', label: 'Card Number', required: true },
        { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
        { name: 'cvv', type: 'password', label: 'CVV', required: true },
        { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
      ],
    },
  };

  const handleFormSelection = (e) => {
    const selected = e.target.value;
    setSelectedForm(selected);
    setFormFields(formOptions[selected]?.fields || []);
    setFormData({});
    setProgress(0);
    setMessage('');
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    const totalFields = formFields.length;
    const filledFields = formFields.filter(
      (f) => updatedFormData[f.name] && (f.required || updatedFormData[f.name].trim() !== '')
    ).length;

    setProgress((filledFields / totalFields) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formFields.some((f) => f.required && !formData[f.name])) {
      setMessage('Please fill out all required fields.');
      return;
    }

    const formType = selectedForm;

    if (editingId) {
      const updatedData = submittedData[formType].map((data) =>
        data.id === editingId ? { ...formData, id: editingId } : data
      );
      setSubmittedData({
        ...submittedData,
        [formType]: updatedData,
      });
    } else {
      setSubmittedData({
        ...submittedData,
        [formType]: [...submittedData[formType], { ...formData, id: Date.now() }],
      });
      setMessage('Form submitted successfully!');
    }

    setFormData({});
    setProgress(0);
    setFormVisible(false);
    setEditingId(null);
  };

  const handleEdit = (id, formType) => {
    const dataToEdit = submittedData[formType].find((data) => data.id === id);
    setFormData(dataToEdit);
    setEditingId(id);
    setFormVisible(true);
  };

  const handleDelete = (id, formType) => {
    setSubmittedData({
      ...submittedData,
      [formType]: submittedData[formType].filter((data) => data.id !== id),
    });
    setMessage('Entry deleted successfully!');
  };

  const handleGoBack = () => {
    setFormVisible(true);
    setFormData({});
    setEditingId(null);
    setMessage('');
  };

  const renderTable = (formType) => (
    <div className="submitted-data-section mt-5">
      <h3 className="mt-4 mb-3 text-primary">{formType}</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            {formOptions[formType].fields.map((field) => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedData[formType].map((data) => (
            <tr key={data.id}>
              {formOptions[formType].fields.map((field) => (
                <td key={field.name}>{data[field.name]}</td>
              ))}
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(data.id, formType)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(data.id, formType)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Container className="mt-4" style={{width:"600px"}}>
      <h1 className="text-center text-primary">Dynamic Form Builder</h1>

      {formVisible && (
        <div className="form-section">
          <Form.Group className="mb-4">
            <Form.Label>Select Form Type</Form.Label>
            <Form.Control as="select" onChange={handleFormSelection}>
              <option value="">-- Select --</option>
              {Object.keys(formOptions).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {formFields.length > 0 && (
            <Form onSubmit={handleSubmit}>
              {formFields.map((field) => (
                <Form.Group className="mb-3" key={field.name}>
                  <Form.Label>{field.label}</Form.Label>
                  {field.type === 'dropdown' ? (
                    <Form.Control
                      as="select"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <Form.Control
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.label}
                      required={field.required}
                    />
                  )}
                </Form.Group>
              ))}

              <ProgressBar now={progress} className="mb-3" label={`${Math.round(progress)}%`} />
              <Button variant="primary" type="submit">
                {editingId ? 'Update' : 'Submit'}
              </Button>
            </Form>
          )}

          {editingId === null && message && <Alert className="mt-3" variant="info">{message}</Alert>}
        </div>
      )}

      {!formVisible && (
        <>
          {Object.keys(submittedData).map(
            (formType) =>
              submittedData[formType].length > 0 && renderTable(formType)
          )}
          <Button className="mt-4" onClick={handleGoBack}>
            Go Back
          </Button>
        </>
      )}
    </Container>
  );
};

export default App;
