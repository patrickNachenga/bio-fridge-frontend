import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../css/dashboard.css";

const FridgeFormModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Fridge name is required")
      .min(3, "Name must be at least 3 characters"),
    code: Yup.string().required("Code is required"),
    model: Yup.string().required("Model is required"),
    serial_number: Yup.string().required("Serial number is required"),
    minimum_temperature: Yup.number()
      .required("Minimum temperature is required")
      .typeError("Must be a number"),
    maximum_temperature: Yup.number()
      .required("Maximum temperature is required")
      .typeError("Must be a number"),
    capacity: Yup.number()
      .required("Capacity is required")
      .positive("Capacity must be positive"),
    block_number: Yup.number()
      .required("Number of blocks is required")
      .positive("Must be positive"),
  });

  const initialValues = editData || {
    name: "",
    code: "",
    model: "",
    serial_number: "",
    minimum_temperature: "",
    maximum_temperature: "",
    capacity: "",
    block_number: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await onSubmit(values);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="fridgeFormModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="fridgeFormModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          {/* Modal Header */}
          <div
            className="modal-header modal-header-gradient"
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <h5 className="modal-title" id="fridgeFormModalLabel">
              {editData ? "Edit Fridge" : "Add New Fridge"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="row">
                    {/* Fridge Name */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        Fridge Name
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="e.g., Fridge A"
                      />
                      <ErrorMessage name="name">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Code */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="code" className="form-label">
                        Code
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="code"
                        name="code"
                        placeholder="e.g., FG001"
                      />
                      <ErrorMessage name="code">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Model */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="model" className="form-label">
                        Model
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="model"
                        name="model"
                        placeholder="e.g., MBF-20"
                      />
                      <ErrorMessage name="model">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Serial Number */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="serial_number" className="form-label">
                        Serial Number
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="serial_number"
                        name="serial_number"
                        placeholder="e.g., SN-12345"
                      />
                      <ErrorMessage name="serial_number">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Minimum Temperature */}
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="minimum_temperature"
                        className="form-label"
                      >
                        Minimum Temperature (°C)
                      </label>
                      <Field
                        type="number"
                        className="form-control"
                        id="minimum_temperature"
                        name="minimum_temperature"
                        placeholder="e.g., -25"
                        step="0.1"
                      />
                      <ErrorMessage name="minimum_temperature">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Maximum Temperature */}
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="maximum_temperature"
                        className="form-label"
                      >
                        Maximum Temperature (°C)
                      </label>
                      <Field
                        type="number"
                        className="form-control"
                        id="maximum_temperature"
                        name="maximum_temperature"
                        placeholder="e.g., -15"
                        step="0.1"
                      />
                      <ErrorMessage name="maximum_temperature">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Capacity */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="capacity" className="form-label">
                        Capacity (samples)
                      </label>
                      <Field
                        type="number"
                        className="form-control"
                        id="capacity"
                        name="capacity"
                        placeholder="e.g., 500"
                      />
                      <ErrorMessage name="capacity">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Number of Blocks */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="block_number" className="form-label">
                        Number of Blocks
                      </label>
                      <Field
                        type="number"
                        className="form-control"
                        id="block_number"
                        name="block_number"
                        placeholder="e.g., 6"
                      />
                      <ErrorMessage name="block_number">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer" style={{ marginTop: "2rem" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary modal-btn-primary"
                      disabled={isSubmitting || loading}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      {loading || isSubmitting ? "Saving..." : "Save Fridge"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FridgeFormModal;
