import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../css/dashboard.css";

const SampleModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    sample_id: Yup.string().required("Sample ID is required"),
    sample_type: Yup.string().required("Sample type is required"),
    source: Yup.string().required("Source is required"),
    nature: Yup.string().required("Nature is required"),
    condition: Yup.string().required("Condition is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
    collection_date: Yup.date().required("Collection date is required"),
    notes: Yup.string(),
  });

  const initialValues = editData || {
    sample_id: "",
    sample_type: "",
    source: "",
    nature: "",
    condition: "",
    quantity: "",
    collection_date: "",
    notes: "",
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
      id="sampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="sampleModalLabel"
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
            <h5 className="modal-title" id="sampleModalLabel">
              {editData ? "Edit Sample" : "Add New Sample"}
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
                    {/* Sample ID */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="sample_id" className="form-label">
                        Sample ID
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="sample_id"
                        name="sample_id"
                        placeholder="e.g., SAM-001"
                      />
                      <ErrorMessage name="sample_id">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Sample Type */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="sample_type" className="form-label">
                        Sample Type
                      </label>
                      <Field
                        as="select"
                        className="form-select"
                        id="sample_type"
                        name="sample_type"
                      >
                        <option value="">Select Type...</option>
                        <option value="blood">Blood</option>
                        <option value="serum">Serum</option>
                        <option value="plasma">Plasma</option>
                        <option value="tissue">Tissue</option>
                        <option value="dna">DNA</option>
                      </Field>
                      <ErrorMessage name="sample_type">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Source */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="source" className="form-label">
                        Source
                      </label>
                      <Field
                        as="select"
                        className="form-select"
                        id="source"
                        name="source"
                      >
                        <option value="">Select Source...</option>
                        <option value="hospital">Hospital</option>
                        <option value="clinic">Clinic</option>
                        <option value="lab">Laboratory</option>
                        <option value="research">Research</option>
                      </Field>
                      <ErrorMessage name="source">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Nature */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nature" className="form-label">
                        Nature
                      </label>
                      <Field
                        as="select"
                        className="form-select"
                        id="nature"
                        name="nature"
                      >
                        <option value="">Select Nature...</option>
                        <option value="fresh">Fresh</option>
                        <option value="preserved">Preserved</option>
                        <option value="frozen">Frozen</option>
                      </Field>
                      <ErrorMessage name="nature">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Condition */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="condition" className="form-label">
                        Condition
                      </label>
                      <Field
                        as="select"
                        className="form-select"
                        id="condition"
                        name="condition"
                      >
                        <option value="">Select Condition...</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </Field>
                      <ErrorMessage name="condition">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Quantity */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="quantity" className="form-label">
                        Quantity
                      </label>
                      <Field
                        type="number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        placeholder="e.g., 5"
                      />
                      <ErrorMessage name="quantity">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Collection Date */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="collection_date" className="form-label">
                        Collection Date
                      </label>
                      <Field
                        type="date"
                        className="form-control"
                        id="collection_date"
                        name="collection_date"
                      />
                      <ErrorMessage name="collection_date">
                        {(msg) => (
                          <small className="text-danger">{msg}</small>
                        )}
                      </ErrorMessage>
                    </div>

                    {/* Notes */}
                    <div className="col-12 mb-3">
                      <label htmlFor="notes" className="form-label">
                        Notes
                      </label>
                      <Field
                        as="textarea"
                        className="form-control"
                        id="notes"
                        name="notes"
                        rows="3"
                        placeholder="Additional notes about the sample..."
                      />
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
                      {loading || isSubmitting ? "Saving..." : "Save Sample"}
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

export default SampleModal;
