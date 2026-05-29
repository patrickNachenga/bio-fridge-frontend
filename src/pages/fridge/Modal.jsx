import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import showToast from "../../helpers/ToastHelper";
import { createUpdateFridge } from "./Queries";
import { FridgeContext } from "../../utils/context";

const FridgeModal = ({ loadOnlyModal = false }) => {
  const { handleFetchData, selectedFridge, setSelectedFridge } =
    useContext(FridgeContext);
  const [errors, setOtherError] = useState({});
  const initialValues = {
    name: selectedFridge?.name || "",
    code: selectedFridge?.code || "",
    description: selectedFridge?.description || "",
    is_active: selectedFridge?.is_active ?? true,
    model: selectedFridge?.model || "",
    serial_number: selectedFridge?.serial_number || "",
    minimum_temperature: selectedFridge?.minimum_temperature ?? "",
    maximum_temperature: selectedFridge?.maximum_temperature ?? "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string().required("Code is required"),
    description: Yup.string(),
    is_active: Yup.boolean(),
    model: Yup.string(),
    serial_number: Yup.string(),
    minimum_temperature: Yup.number()
      .typeError("Minimum temperature must be a number")
      .nullable()
      .test(
        "min-less-great-max",
        "Must be gret than maximum",
        function (value) {
          const { maximum_temperature } = this.parent;
          if (value === "" || maximum_temperature === "") return true;
          if (value == null || maximum_temperature == null) return true;
          return value > maximum_temperature;
        }
      ),
    maximum_temperature: Yup.number()
      .typeError("Maximum temperature must be a number")
      .nullable(),
  });

  // console.log("Selected Fridge:", selectedFridge);

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      if (selectedFridge) {
        values.uid = selectedFridge.uid;
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
    if (!loadOnlyModal) {
      setSelectedFridge(null);
    }
    const modalElement = document.getElementById("viewCreateDataModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  };

  return (
    <>
      {!loadOnlyModal && (
        <button
          aria-label="Click me"
          type="button"
          className="btn btn-primary ms-auto btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#viewCreateDataModal"
        >
          <i className="bx bx-edit-alt me-1"></i> Add Fridge
        </button>
      )}

      <div
        className="modal modal-slide-in"
        id="viewCreateDataModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel3">
                {selectedFridge === null ? "Create New" : "View / Update"}{" "}
                Fridge{" "}
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
                      <div className="col-md-6 mb-3">
                        <label htmlFor="modelLarge" className="form-label">
                          Model
                        </label>
                        <Field
                          type="text"
                          name="model"
                          id="modelLarge"
                          className="form-control"
                          placeholder="Enter Model"
                        />
                        <ErrorMessage
                          name="model"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label
                          htmlFor="serialNumberLarge"
                          className="form-label"
                        >
                          Serial Number
                        </label>
                        <Field
                          type="text"
                          name="serial_number"
                          id="serialNumberLarge"
                          className="form-control"
                          placeholder="Enter Serial Number"
                        />
                        <ErrorMessage
                          name="serial_number"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="minTempLarge" className="form-label">
                          Minimum Temperature (&#176;C)
                        </label>
                        <Field
                          type="number"
                          name="minimum_temperature"
                          id="minTempLarge"
                          className="form-control"
                          placeholder="Min Temp"
                        />
                        <ErrorMessage
                          name="minimum_temperature"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="maxTempLarge" className="form-label">
                          Maximum Temperature (&#176;C)
                        </label>
                        <Field
                          type="number"
                          name="maximum_temperature"
                          id="maxTempLarge"
                          className="form-control"
                          placeholder="Max Temp"
                        />
                        <ErrorMessage
                          name="maximum_temperature"
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
                            className="form-check-input"
                            id="statusSwitch"
                            checked={values.is_active}
                            onChange={(e) =>
                              setFieldValue("is_active", e.target.checked)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="statusSwitch"
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

export default FridgeModal;
