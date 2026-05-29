import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import showToast from "../../helpers/ToastHelper";
import ReactLoading from "react-loading";
import usePagination from "../../hooks/usePagination";
import ReactPaginate from "react-paginate";
import "animate.css";
import { deleteFridge, getFridges } from "./Queries";
import { FridgeContext } from "../../utils/context";
import FridgeModal from "./Modal";
import FridgeSVGCard from "./FridgeSVGCard";
import FridgeAdvancedTable from "./FridgeAdvancedTable";
import FridgeDetailPanel from "./FridgeDetailPanel";
import { Row } from "reactstrap";
import { getPercentageColor } from "../../helpers/PercentageColorHelper";
import { useNavigate } from "react-router-dom";

export const FridgePage = () => {
  const navigate = useNavigate();
  const pageSizeData = [6, 10, 20, 50, 70, 100];
  const [fridges, setFridges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFridge, setSelectedFridge] = useState(null);
  const [detailPanelFridge, setDetailPanelFridge] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'table'
  const {
    currentPage,
    totalCount,
    pageSize,
    updatePage,
    updatePageSize,
    updatePagination,
    updateTotalCount,
  } = usePagination(10, 1, true);

  const handlePageClick = (event) => {
    updatePage(event.selected + 1);
  };

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFridges({
        search: searchQuery,
        pagination: {
          page: currentPage,
          page_size: pageSize,
          paginated: true,
        },
      });
      if (result.status === 200 || result.status === 8000) {
        setFridges(result.data);
        if (result.pagination) {
          updatePagination(result.pagination);
          updateTotalCount(result.pagination.total || 0);
        } else {
          updatePagination({});
        }
      } else {
        setError(true);
        showToast("No Fridge Found", "warning", "Fetch Completed");
      }
    } catch (err) {
      setError(true);
      showToast("Unable to Fetch Fridges", "warning", "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fridge = null) => {
    if (!fridge) {
      Swal.fire("Error!", "Unable to Select this Fridge.", "error");
      return;
    }

    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Your About to Delete the data",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        cancelButtonColor: "#aaa",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmation.isConfirmed) {
        const result = await deleteFridge(fridge.uid);
        if (result.status === 200 || result.status === 8000) {
          Swal.fire(
            "Process Completed!",
            "The Fridge has been deleted.",
            "success",
          );
          handleFetchData();
        } else {
          console.error("Error deleting Fridge:", result);
          Swal.fire("Error Occurred!", `${result.message}`, "error");
        }
      }
    } catch (error) {
      console.error("Error deleting Fridge:", error);
      Swal.fire(
        "Unsuccessful",
        `Unable to Perform Delete. Please Try Again or Contact Support Team`,
        "error",
      );
    }

    setSelectedFridge(null); // Reset selected Fridge after deletion
  };
  // Fetch Fridges on initial load
  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Set new debounce timeout
    const timeout = setTimeout(() => {
      handleFetchData();
    }, 1500); // 2.5 seconds

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [searchQuery, pageSize, currentPage]); // Fetch when search query changes

  return (
    <FridgeContext.Provider
      value={{
        handleFetchData,
        selectedFridge,
        setSelectedFridge,
      }}
    >
      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">Setting /</span> Fridges
      </h4>
      <div className="card">
        <div className="d-flex justify-content-between align-items-center card-header">
          <h5 className="mb-0">List Of All Fridges</h5>
          <FridgeModal
            title="View Fridges"
            onClose={() => setSelectedFridge(null)}
          />
        </div>

        <div className="card-body ">
          <div className="d-flex justify-content-between align-items-center mb-2 animate__animated animate__fadeInDown animate__faster">
            <div className="d-flex align-items-center col-md-8 col-sm-6">
              <label className="text-sm font-medium me-2 mb-0">
                Rows per page:
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  updatePageSize(Number(e.target.value));
                  updatePage(1);
                  updatePagination({
                    page: 1,
                    page_size: Number(e.target.value),
                  });
                }}
                className="form-select"
                aria-label="Default select example"
                style={{ width: "80px" }}
              >
                {pageSizeData.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className=" col-md-4 col-sm-6">
              <form className="d-flex">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="tf-icons bx bx-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      updatePage(1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleFetchData();
                      }
                    }}
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="text-nowrap animate__animated animate__fadeInUp animate__faster">
            <ul className="nav nav-pills mb-3 mt-4" role="tablist">
              <li className="nav-item">
                <button
                  aria-label="Click me"
                  type="button"
                  className={`nav-link ${viewType === "grid" ? "active" : ""}`}
                  role="tab"
                  style={{ width: "150px", height: "30px" }}
                  onClick={() => setViewType("grid")}
                >
                  <i className="bx bx-grid-alt me-1"></i>&nbsp;Grid View
                </button>
              </li>
              <li className="nav-item">
                <button
                  aria-label="Click me"
                  type="button"
                  className={`nav-link ${viewType === "table" ? "active" : ""}`}
                  role="tab"
                  style={{ width: "150px", height: "30px" }}
                  onClick={() => setViewType("table")}
                >
                  <i className="bx bx-table me-1"></i>&nbsp;Table View
                </button>
              </li>
            </ul>
            {/* Grid View */}
            {viewType === "grid" && (
              <div className="mt-4">
                {loading ? (
                  <div className="col-md-12 col-lg-12 col-sm-12 p-2">
                    <center>
                      <ReactLoading
                        type={"cylon"}
                        color={"#696cff"}
                        height={"30px"}
                        width={"50px"}
                      />
                    </center>
                    <center className="mt-1">
                      <h6 className="text-muted">Fetching Fridges</h6>
                    </center>
                  </div>
                ) : error || fridges.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    <div className="alert-body text-center">
                      <p className="mb-0">No Data Found</p>
                    </div>
                  </div>
                ) : (
                  <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {fridges.map((fridge) => (
                      <div key={fridge.uid} style={{ cursor: "pointer" }}>
                        <FridgeSVGCard
                          fridge={fridge}
                          onClick={() => setDetailPanelFridge(fridge)}
                          showDetails={true}
                        />
                      </div>
                    ))}
                  </Row>
                )}
              </div>
            )}

            {/* Table View */}
            {viewType === "table" && (
              <div className="mt-4">
                <FridgeAdvancedTable
                  fridges={fridges}
                  loading={loading}
                  onRowClick={(fridge) =>
                    navigate(`/fridges/open/${fridge.uid}`)
                  }
                  onEdit={(fridge) => {
                    setSelectedFridge(fridge);
                    // Trigger modal open
                    document
                      .querySelector('[data-bs-target="#viewCreateDataModal"]')
                      ?.click();
                  }}
                  onDelete={handleDelete}
                  currentPage={currentPage}
                  pageSize={pageSize}
                />
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* Your content here */}
              <div></div>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil((totalCount || 0) / (pageSize || 1))}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel Backdrop */}
      {detailPanelFridge && (
        <>
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setDetailPanelFridge(null)}
          ></div>
          <FridgeDetailPanel
            fridge={detailPanelFridge}
            onClose={() => setDetailPanelFridge(null)}
            onEdit={(fridge) => {
              setSelectedFridge(fridge);
              document
                .querySelector('[data-bs-target="#viewCreateDataModal"]')
                ?.click();
              setDetailPanelFridge(null);
            }}
            onDelete={(fridge) => {
              handleDelete(fridge);
              setDetailPanelFridge(null);
            }}
          />
        </>
      )}
    </FridgeContext.Provider>
  );
};
