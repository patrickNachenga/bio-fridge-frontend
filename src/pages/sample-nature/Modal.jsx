import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createUpdateSampleNature } from "./Queries";
import showToast from "../../helpers/ToastHelper";
import { SampleNatureContext } from "../../utils/context";
import Select from "react-select";

const SampleNatureModal = () => {
  const { fetchSampleNatures, selectedSampleNature, setSelectedSampleNature } =
    useContext(SampleNatureContext);
  const [errors, setOtherError] = useState({});

  const initialValues = {
    name: selectedSampleNature?.name || "",
    code: selectedSampleNature?.code || "",
    description: selectedSampleNature?.description || "",
    is_active: selectedSampleNature?.is_active ?? true,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string().required("Code is required"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      // Check if the SampleNature is being created or updated
      if (selectedSampleNature) {
        values.uid = selectedSampleNature.uid;
      }
      // Call the API to create or update the SampleNature
      const result = await createUpdateSampleNature(values);

      if (result.status === 200 || result.status === 8000) {
        showToast("Data Saved Successfuly", "success", "Complete");
        handleClose();
        resetForm();
        fetchSampleNatures();
      } else if (result.status === 8002) {
        console.log("Validation error:", result.data);
        showToast(`${result.message}`, "warning", "Validation Failed");
        setErrors(result.data);
        setOtherError(result.data);
      } else {
        showToast(`${result.message}`, "warning", "Process Failed");
        handleClose();
        resetForm();
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      showToast("Something went wrong while saving", "error", "Failed");
      handleClose(); // Close the modal after submission
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {}, []);

  const handleClose = () => {
    setSelectedSampleNature(null);
    const modalElement = document.getElementById("viewCreateDataModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  };

  return (
    <>
      <button
        aria-label="Click me"
        type="button"
        className="btn btn-primary ms-auto btn-sm"
        data-bs-toggle="modal"
        data-bs-target="#viewCreateDataModal"
      >
        <i className="bx bx-edit-alt me-1"></i> Add Sample Nature
      </button>

      <div
        className="modal modal-slide-in"
        id="viewCreateDataModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel3">
                {selectedSampleNature === null ? "Create New" : "View / Update"}{" "}
                SampleNatures{" "}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col mb-3">
                        <label htmlFor="nameLarge" className="form-label">
                          Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          id="nameLarge"
                          className="form-control"
                          placeholder="Enter Name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="col mb-3">
                        <label htmlFor="codeLarge" className="form-label">
                          Code
                        </label>
                        <Field
                          type="text"
                          name="code"
                          id="codeLarge"
                          className="form-control"
                          placeholder="Enter Code"
                        />
                        <ErrorMessage
                          name="code"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col mb-3">
                        <label
                          htmlFor="descriptionLarge"
                          className="form-label"
                        >
                          Description
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          id="descriptionLarge"
                          className="form-control"
                          rows="3"
                          placeholder="Enter Description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    {errors.non_field_errors &&
                      errors.non_field_errors.length > 0 && (
                        <div className="text-danger">
                          {errors.non_field_errors.map((error, index) => (
                            <div key={index}>{error}</div>
                          ))}
                        </div>
                      )}

                    <div className="modal-footer">
                      <button
                        aria-label="Click me"
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleClose}
                        className="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        aria-label="Click me"
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default SampleNatureModal;
