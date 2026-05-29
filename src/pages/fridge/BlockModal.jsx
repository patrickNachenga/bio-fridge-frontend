import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import showToast from "../../helpers/ToastHelper";
import { createUpdateFridge } from "./Queries";
import { FridgeContext } from "../../utils/context";

const BlockModal = () => {
  const { handleFetchData, selectedFridge, setSelectedFridge } =
    useContext(FridgeContext);
  const [errors, setOtherError] = useState({});

  const initialValues = {
    name: "",
    code: "",
    description: "",
    is_active: false,
    fridge_uid: selectedFridge?.uid || "",
    number_partitions: 1,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string().required("Code is required"),
    description: Yup.string(),
    is_active: Yup.boolean(),
    fridge_uid: Yup.string().required("Fridge is required"),
    number_partitions: Yup.number()
      .required("Number of partitions is required")
      .min(1, "Number of partitions must be at least 1"),
  });

  // console.log("Selected Fridge:", selectedFridge);

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      if (selectedFridge) {
        values.uid = selectedFridge?.uid;
      }

      const result = await createUpdateFridge(values);

      if (result.status === 200 || result.status === 8000) {
        showToast("Data Saved Successfuly", "success", "Complete");
        handleClose();
        resetForm();
        handleFetchData();
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

  const handleClose = () => {
    console.log("Modal closed");
    // setSelectedFridge(null);
    const modalElement = document.getElementById("viewCreateDataModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  };

  return (
    <>
      <div
        className="modal modal-slide-in"
        id="viewCreateBlockDataModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel3">
                {selectedFridge === null ? "Create New" : "Create New"} Block
                For {selectedFridge?.name}{" "}
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
                        <label htmlFor="fridgeUidLarge" className="form-label">
                          Fridge
                        </label>
                        <Field
                          type="readonly"
                          name="fridge"
                          value={selectedFridge?.name}
                          disabled={true}
                          id="fridgeUidLarge"
                          className="form-control"
                          placeholder="Enter Name"
                        />
                        <Field
                          type="hidden"
                          name="fridge_uid"
                          value={selectedFridge?.name}
                          disabled={true}
                          id="fridgeUidLarge"
                          className="form-control"
                          placeholder="Enter Name"
                        />
                        <ErrorMessage
                          name="fridge_uid"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
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
                      <div className="col-md-6 mb-3">
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
                        <label htmlFor="partitionsLarge" className="form-label">
                          Number of Partitions
                        </label>
                        <Field
                          type="number"
                          name="number_partitions"
                          id="partitonLarge"
                          className="form-control"
                          placeholder="Enter Number Of Partitionr"
                          min="1"
                        />
                        <ErrorMessage
                          name="number_partitions"
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
                          style={{ minHeight: "100px" }}
                          name="description"
                          id="descriptionLarge"
                          className="form-control"
                          placeholder="Enter Description"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col mb-3">
                        <label htmlFor="statusSwitch" className="form-label">
                          Activate or Deactivate Option:
                        </label>
                        <div className="form-check form-switch">
                          <Field
                            type="checkbox"
                            className={`form-check-input ${
                              values.is_active ? "bg-primary" : "bg-default"
                            }`}
                            id="statusSwitch"
                            style={{
                              cursor: "pointer",
                              width: "45px",
                              marginRight: "10px",
                            }}
                            checked={values.is_active}
                            onChange={(e) =>
                              setFieldValue("is_active", e.target.checked)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="statusSwitch"
                            onClick={() =>
                              setFieldValue("is_active", !values.is_active)
                            }
                          >
                            {values.is_active ? "Active" : "Inactive"}
                          </label>
                        </div>
                        <ErrorMessage
                          name="is_active"
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

export default BlockModal;
