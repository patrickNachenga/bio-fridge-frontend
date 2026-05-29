import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import showToast from "../../helpers/ToastHelper";
import ReactLoading from "react-loading";
import usePagination from "../../hooks/usePagination";
import ReactPaginate from "react-paginate";
import "animate.css";
import { getApprovalRequests, deleteApprovalRequest } from "./Queries";
import { ApprovalRequestsContext } from "../../utils/context";
import ApprovalRequestModal from "./Modal";

export const ApprovalRequestPage = () => {
  const pageSizeData = [5, 10, 20, 50, 70, 100];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectApprovalRequest, setSelectedApprovalRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
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

  const handleTopBarClick = () => {
    alert('You clicked the grey top bar!');
  };

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getApprovalRequests({
        search: searchQuery,
        pagination: {
          page: currentPage,
          page_size: pageSize,
          paginated: true,
        },
      });
      if (result.status === 200 || result.status === 8000) {
        setApprovalRequests(result.data);
        console.log("Approval Requests:", result.data);
        if (result.pagination) {
          updatePagination(result.pagination);
          updateTotalCount(result.pagination.total || 0);
        } else {
          updatePagination({});
        }
      } else {
        setError(true);
        showToast("No Approval Action Found", "warning", "Fetch Completed");
      }
    } catch (err) {
      setError(true);
      if (err.status === 401) {
        showToast(
          "Session Expired. Please Login Again",
          "error",
          "Session Expired"
        );
      } else {
        showToast("Unable to Fetch Approval Request", "warning", "Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (approvalRequest = null) => {
    if (!approvalRequest) {
      Swal.fire("Error!", "Unable to Select this approval Action.", "error");
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
        const result = await deleteApprovalRequest(approvalRequest.uid);
        if (result.status === 200 || result.status === 8000) {
          Swal.fire(
            "Process Completed!",
            "The approval Action has been deleted.",
            "success"
          );
          handleFetchData();
        } else {
          console.error("Error deleting approval Action:", result);
          Swal.fire("Error Occurred!", `${result.message}`, "error");
        }
      }
    } catch (error) {
      console.error("Error deleting approval Action:", error);
      Swal.fire(
        "Unsuccessful",
        `Unable to Perform Delete. Please Try Again or Contact Support Team`,
        "error"
      );
    }

    setSelectedApprovalRequest(null); // Reset selected ApprovalRequest after deletion
  };
  // Fetch ApprovalRequests on initial load
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
    <ApprovalRequestsContext.Provider
      value={{
        handleFetchData,
        selectApprovalRequest,
        setSelectedApprovalRequest,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">Setting /</span> Approval Requests
      </h4>
      <div className="card">
        <div className="d-flex justify-content-between align-items-center card-header">
          <h5 className="mb-0">List Of All Request</h5>
          <ApprovalRequestModal
            title="View Approval Request"
            onClose={() => setSelectedApprovalRequest(null)}
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
          <div className=" text-nowrap animate__animated animate__fadeInUp animate__faster">
            <div
              className="table-responsive "
              style={{ paddingBottom: "15px" }}
            >
              <table className="table table-hover table-align-middle mb-0 table-bordered">
                <thead style={{ backgroundColor: "#f1f1f1" }}>
                  <tr>
                    <th style={{ width: "50px" }}>S/N</th>
                    <th>DATE</th>
                    <th>Request Type</th>
                    <th>Request Title</th>
                    <th>Requested By</th>
                    <th>Department</th>
                    <th style={{ width: "100px" }}>Status</th>
                    <th style={{ width: "60px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0">
                  {loading ? (
                    <tr>
                      <td colSpan="100%">
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
                            <h6 className="text-muted">
                              Fetching Approval Request
                            </h6>
                          </center>
                        </div>
                      </td>
                    </tr>
                  ) : error || approvalRequests.length === 0 ? (
                    <tr>
                      <td colSpan="100%">
                        <div className="alert alert-info" role="alert">
                          <div className="alert-body text-center">
                            <p className="mb-0">No Data Found</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                        approvalRequests.map((dataRows, index) => (
                          <tr key={dataRows.uid}>
                            <td>{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="fw-medium">
                              {new Date(dataRows.created_at).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="fw-medium">{dataRows.type}</td>
                            <td className="fw-medium">{dataRows.title}</td>
                            <td className="fw-medium">{dataRows.created_by}</td>
                            <td className="fw-medium">
                              {dataRows.department.code}
                            </td>
                            <td>
                              <span
                                className={
                                  dataRows.status === "NEW"
                                    ? "badge bg-label-primary me-1"
                                    : dataRows.status === "PENDING"
                                      ? "badge bg-label-warning me-1"
                                      : dataRows.status === "REJECTED" ||
                                        dataRows.status === "CANCELLED" ||
                                        dataRows.status === "EXPIRED"
                                        ? "badge bg-label-danger me-1"
                                        : dataRows.status === "APPROVED"
                                          ? "badge bg-label-success me-1"
                                          : "badge bg-label-info me-1"
                                }
                              >
                                {dataRows.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="dropdown">
                                <button
                                  aria-label="Click me"
                                  type="button"
                                  className="btn p-0 dropdown-toggle hide-arrow"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="bx bx-menu"></i>
                                </button>
                                <div className="dropdown-menu">
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={() => {
                                      setSelectedApprovalRequest(dataRows);
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewCreateDataModal"
                                  >
                                    <i className="bx bx-edit-alt me-1"></i> View /
                                    Edit
                                  </a>
                                  <a
                                    aria-label="dropdown action option"
                                    className="dropdown-item text-danger"
                                    href="#"
                                    onClick={async () => {
                                      handleDelete(dataRows);
                                    }}
                                  >
                                    <i className="bx bx-trash me-1"></i> Delete
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                  )}
                </tbody>
              </table>
              {/* 
              <svg width="300" height="273" viewBox="0 0 300 273" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <rect width="300" height="273" fill="url(#pattern0_1_13)" />
                <rect x="57.4222" y="28.08" width="64.3129" height="14.82" rx="7.41" fill="#CED7D5" />
                <path d="M90.3716 32.8C91.0996 32.54 91.8233 32.41 92.5426 32.41C93.262 32.41 93.8513 32.592 94.3106 32.956C94.77 33.32 94.9996 33.7793 94.9996 34.334C94.9996 34.7673 94.887 35.1487 94.6616 35.478C94.4363 35.7987 94.1156 36.0413 93.6996 36.206C94.3063 36.4313 94.744 36.713 95.0126 37.051C95.2813 37.3803 95.4156 37.8007 95.4156 38.312C95.4156 39.092 95.1123 39.7377 94.5056 40.249C93.9076 40.7517 93.145 41.003 92.2176 41.003C91.7756 41.003 91.3423 40.9467 90.9176 40.834C90.5016 40.7127 90.194 40.5913 89.9946 40.47L89.6956 40.288L90.2416 38.715C90.3196 38.7843 90.4236 38.871 90.5536 38.975C90.6836 39.079 90.9306 39.222 91.2946 39.404C91.6673 39.5773 92.04 39.664 92.4126 39.664C92.7853 39.664 93.1103 39.5643 93.3876 39.365C93.665 39.157 93.8036 38.8667 93.8036 38.494C93.8036 38.1213 93.639 37.8137 93.3096 37.571C92.989 37.3283 92.5426 37.207 91.9706 37.207H90.8526L91.0866 35.946H91.8016C92.2783 35.946 92.651 35.8377 92.9196 35.621C93.1883 35.4043 93.3226 35.127 93.3226 34.789C93.3226 34.451 93.21 34.191 92.9846 34.009C92.7593 33.8183 92.4863 33.723 92.1656 33.723C91.8536 33.723 91.5286 33.7793 91.1906 33.892C90.8613 33.996 90.4973 34.1563 90.0986 34.373L90.3716 32.8ZM99.9953 32.423C100.888 32.423 101.603 32.7783 102.14 33.489C102.686 34.191 102.959 35.1227 102.959 36.284C102.959 37.7487 102.63 38.9013 101.971 39.742C101.321 40.5827 100.424 41.003 99.2803 41.003C98.405 41.003 97.69 40.6477 97.1353 39.937C96.5893 39.2177 96.3163 38.2817 96.3163 37.129C96.3163 35.751 96.6586 34.6243 97.3433 33.749C98.0366 32.865 98.9206 32.423 99.9953 32.423ZM99.6963 39.729C100.251 39.729 100.637 39.5167 100.853 39.092C101.079 38.6673 101.191 37.9133 101.191 36.83C101.191 35.7467 101.079 34.9883 100.853 34.555C100.628 34.113 100.234 33.892 99.6703 33.892C99.107 33.892 98.6996 34.1 98.4483 34.516C98.2056 34.9233 98.0843 35.6383 98.0843 36.661C98.0843 37.675 98.2143 38.442 98.4743 38.962C98.7343 39.4733 99.1416 39.729 99.6963 39.729ZM108.362 31.825C108.995 31.825 109.506 32.072 109.896 32.566C110.295 33.0513 110.494 33.6883 110.494 34.477C110.494 35.4737 110.256 36.2623 109.779 36.843C109.311 37.415 108.665 37.701 107.842 37.701C107.218 37.701 106.707 37.454 106.308 36.96C105.909 36.466 105.71 35.79 105.71 34.932C105.71 34.074 105.957 33.3417 106.451 32.735C106.954 32.1283 107.591 31.825 108.362 31.825ZM108.141 36.713C108.514 36.713 108.769 36.583 108.908 36.323C109.047 36.0543 109.116 35.5647 109.116 34.854C109.116 34.1347 109.042 33.6407 108.895 33.372C108.756 33.0947 108.496 32.956 108.115 32.956C107.742 32.956 107.478 33.0817 107.322 33.333C107.166 33.5843 107.088 34.048 107.088 34.724C107.088 35.4 107.17 35.9027 107.335 36.232C107.508 36.5527 107.777 36.713 108.141 36.713ZM115.551 35.023C116.184 35.023 116.695 35.27 117.085 35.764C117.484 36.2493 117.683 36.8863 117.683 37.675C117.683 38.6717 117.445 39.4603 116.968 40.041C116.5 40.613 115.854 40.899 115.031 40.899C114.407 40.899 113.896 40.652 113.497 40.158C113.098 39.664 112.899 38.988 112.899 38.13C112.899 37.272 113.146 36.5397 113.64 35.933C114.143 35.3263 114.78 35.023 115.551 35.023ZM115.33 39.911C115.703 39.911 115.958 39.781 116.097 39.521C116.236 39.2523 116.305 38.7627 116.305 38.052C116.305 37.3327 116.231 36.8387 116.084 36.57C115.945 36.2927 115.685 36.154 115.304 36.154C114.931 36.154 114.667 36.2797 114.511 36.531C114.355 36.7823 114.277 37.246 114.277 37.922C114.277 38.598 114.359 39.1007 114.524 39.43C114.697 39.7507 114.966 39.911 115.33 39.911ZM109.337 42.407L108.31 41.991L113.783 31.006L114.81 31.422L109.337 42.407Z" fill="#604A4A" />
                <rect x="7.19177" y="97.5" width="164.384" height="21.45" rx="10.725" fill="#CED7D5" />
                <rect x="9.24658" y="125.775" width="162.329" height="82.875" rx="19" fill="#CED7D5" />
                <ellipse cx="67.7582" cy="35.88" rx="3.44533" ry="3.9" fill="#B5C207" />
                <ellipse cx="79.2427" cy="35.88" rx="3.44533" ry="3.9" fill="#B5C207" />
                <path d="M24.5243 109.884C25.3176 110.677 26.111 111.074 26.9043 111.074C27.315 111.074 27.6416 110.981 27.8843 110.794C28.1363 110.598 28.2623 110.351 28.2623 110.052C28.2623 109.744 28.113 109.487 27.8143 109.282C27.5156 109.067 27.1516 108.881 26.7223 108.722C26.3023 108.563 25.8823 108.386 25.4623 108.19C25.0423 107.985 24.683 107.695 24.3843 107.322C24.0856 106.949 23.9363 106.496 23.9363 105.964C23.9363 105.124 24.2863 104.401 24.9863 103.794C25.6863 103.178 26.517 102.87 27.4783 102.87C27.917 102.87 28.3416 102.917 28.7523 103.01C29.163 103.103 29.5596 103.239 29.9423 103.416L28.9903 105.46C28.729 105.255 28.3696 105.068 27.9123 104.9C27.4643 104.723 27.0676 104.634 26.7223 104.634C26.3863 104.634 26.111 104.718 25.8963 104.886C25.691 105.045 25.5883 105.259 25.5883 105.53C25.5883 105.801 25.7376 106.043 26.0363 106.258C26.335 106.463 26.6943 106.645 27.1143 106.804C27.5436 106.963 27.9683 107.14 28.3883 107.336C28.8176 107.523 29.1816 107.803 29.4803 108.176C29.779 108.549 29.9283 109.002 29.9283 109.534C29.9283 110.411 29.5783 111.181 28.8783 111.844C28.1783 112.497 27.3616 112.824 26.4283 112.824C25.7283 112.824 25.1076 112.656 24.5663 112.32C24.0903 112.031 23.7543 111.774 23.5583 111.55L23.4323 111.396L24.5243 109.884ZM32.5033 112.67C31.9527 112.67 31.5 112.497 31.1453 112.152C30.8 111.797 30.6273 111.326 30.6273 110.738C30.6273 110.141 30.898 109.627 31.4393 109.198C31.9807 108.759 32.6387 108.54 33.4133 108.54H34.3653V108.302C34.3653 107.845 34.272 107.532 34.0853 107.364C33.8987 107.196 33.5487 107.112 33.0353 107.112C32.8207 107.112 32.564 107.159 32.2653 107.252C31.976 107.336 31.6493 107.471 31.2853 107.658L30.8793 106.552C31.2807 106.272 31.766 106.02 32.3353 105.796C32.914 105.572 33.39 105.46 33.7633 105.46C35.2287 105.46 35.9613 106.169 35.9613 107.588V110.332C35.9613 110.855 36.1247 111.438 36.4513 112.082L34.9673 112.712C34.734 112.264 34.5613 111.863 34.4493 111.508C33.936 112.283 33.2873 112.67 32.5033 112.67ZM33.0913 111.242C33.4647 111.242 33.8893 111.051 34.3653 110.668V109.73C33.8707 109.618 33.4693 109.562 33.1613 109.562C32.5733 109.562 32.2793 109.823 32.2793 110.346C32.2793 110.617 32.354 110.836 32.5033 111.004C32.6527 111.163 32.8487 111.242 33.0913 111.242ZM41.7258 109.128C41.7258 108.484 41.6698 108.055 41.5578 107.84C41.4458 107.625 41.1845 107.518 40.7738 107.518C40.3632 107.518 39.8965 107.681 39.3738 108.008V109.03L39.5278 112.32L37.6518 112.67L37.8198 109.268C37.7825 108.017 37.6798 106.897 37.5118 105.908L39.2058 105.544C39.2712 106.085 39.3178 106.613 39.3458 107.126C39.4858 106.939 39.6445 106.757 39.8218 106.58C39.9992 106.393 40.2792 106.188 40.6618 105.964C41.0445 105.731 41.4318 105.614 41.8238 105.614C42.2158 105.614 42.5472 105.74 42.8178 105.992C43.0885 106.244 43.2612 106.589 43.3358 107.028C44.1105 106.085 44.8945 105.614 45.6878 105.614C46.1825 105.614 46.5745 105.782 46.8638 106.118C47.1532 106.445 47.2978 106.893 47.2978 107.462L47.2138 109.03L47.3678 112.39L45.4778 112.74L45.6458 109.128C45.6458 108.484 45.5898 108.055 45.4778 107.84C45.3658 107.625 45.1092 107.518 44.7078 107.518C44.3065 107.518 43.8538 107.672 43.3498 107.98L43.2938 109.03L43.4478 112.39L41.5578 112.74L41.7258 109.128ZM52.6421 105.6C53.2394 105.6 53.7388 105.861 54.1401 106.384C54.5508 106.907 54.7561 107.611 54.7561 108.498C54.7561 109.739 54.4341 110.747 53.7901 111.522C53.1554 112.287 52.3621 112.67 51.4101 112.67C51.2141 112.67 50.9948 112.656 50.7521 112.628L50.8221 115.302L48.9041 115.652L49.0861 109.268H49.1001C49.0628 108.017 48.9601 106.897 48.7921 105.908L50.4861 105.544C50.5421 106.039 50.5888 106.529 50.6261 107.014C50.6448 106.967 50.7381 106.841 50.9061 106.636C51.0834 106.421 51.3401 106.197 51.6761 105.964C52.0121 105.721 52.3341 105.6 52.6421 105.6ZM52.0961 107.42C51.6014 107.42 51.1208 107.555 50.6541 107.826V109.03L50.7101 111.032C51.2141 111.116 51.5968 111.158 51.8581 111.158C52.7541 111.158 53.2021 110.537 53.2021 109.296C53.2021 108.045 52.8334 107.42 52.0961 107.42ZM57.8358 101.834L57.6538 109.03L57.8078 112.32L55.9178 112.67L56.0858 109.268L55.9178 102.184L57.8358 101.834ZM61.9788 111.242C62.2495 111.242 62.5341 111.172 62.8328 111.032C63.1315 110.892 63.3648 110.752 63.5328 110.612L63.7848 110.402L64.4288 111.186C64.3355 111.345 64.1908 111.527 63.9948 111.732C63.7988 111.937 63.5981 112.115 63.3928 112.264C63.1968 112.404 62.9308 112.535 62.5948 112.656C62.2681 112.768 61.9275 112.824 61.5728 112.824C60.8168 112.824 60.2008 112.539 59.7248 111.97C59.2488 111.391 59.0108 110.649 59.0108 109.744C59.0108 108.605 59.3421 107.607 60.0048 106.748C60.6675 105.889 61.4421 105.46 62.3288 105.46C63.0101 105.46 63.5375 105.651 63.9108 106.034C64.2935 106.417 64.4848 106.953 64.4848 107.644C64.4848 108.055 64.4148 108.521 64.2748 109.044L63.9948 109.338L60.4948 109.66C60.6535 110.715 61.1481 111.242 61.9788 111.242ZM61.9788 106.902C61.5681 106.902 61.2228 107.07 60.9428 107.406C60.6628 107.733 60.4995 108.153 60.4528 108.666L62.8328 108.372C62.8608 108.157 62.8748 107.98 62.8748 107.84C62.8748 107.215 62.5761 106.902 61.9788 106.902ZM73.089 104.508H70.107L70.023 107.084H72.697L72.543 108.568H69.981L69.967 109.03L70.135 112.67H68.175L68.343 109.268L68.175 103.01H73.243L73.089 104.508ZM73.9064 105.908L75.6004 105.544C75.6844 106.263 75.7404 106.944 75.7684 107.588C76.6177 106.272 77.4157 105.614 78.1624 105.614L78.0084 107.798C77.467 107.798 77.0377 107.849 76.7204 107.952C76.4124 108.045 76.095 108.237 75.7684 108.526V109.03L75.9224 112.32L74.0464 112.67L74.2144 109.268C74.177 108.017 74.0744 106.897 73.9064 105.908ZM80.9266 105.544L80.7586 109.03L80.9126 112.32L79.0366 112.67L79.2046 109.268L79.0506 105.894L80.9266 105.544ZM78.9526 103.5C78.9526 103.183 79.0739 102.903 79.3166 102.66C79.5593 102.408 79.8393 102.282 80.1566 102.282C80.4739 102.282 80.7166 102.371 80.8846 102.548C81.0526 102.716 81.1366 102.973 81.1366 103.318C81.1366 103.663 81.0153 103.962 80.7726 104.214C80.5393 104.457 80.2639 104.578 79.9466 104.578C79.6386 104.578 79.3959 104.475 79.2186 104.27C79.0413 104.065 78.9526 103.808 78.9526 103.5ZM86.1646 111.298C85.4366 112.213 84.8066 112.67 84.2746 112.67C83.6119 112.67 83.0659 112.399 82.6366 111.858C82.2166 111.317 82.0066 110.621 82.0066 109.772C82.0066 108.605 82.3286 107.621 82.9726 106.818C83.6259 106.015 84.4239 105.614 85.3666 105.614L86.1506 105.726V105.46L85.9826 102.184L87.9006 101.834L87.7186 109.03V110.262C87.7186 110.822 87.8586 111.466 88.1386 112.194L86.6266 112.824C86.3559 112.264 86.2019 111.755 86.1646 111.298ZM83.5746 109.044C83.5746 109.641 83.6819 110.108 83.8966 110.444C84.1206 110.78 84.4379 110.948 84.8486 110.948C85.2686 110.948 85.7026 110.78 86.1506 110.444V107.42C85.5906 107.308 85.1752 107.252 84.9046 107.252C84.4846 107.252 84.1579 107.401 83.9246 107.7C83.6912 107.999 83.5746 108.447 83.5746 109.044ZM89.0059 114.056C89.0059 113.235 89.7712 112.591 91.3019 112.124C90.9379 111.937 90.7559 111.695 90.7559 111.396C90.7559 111.275 90.8026 111.153 90.8959 111.032C90.9892 110.911 91.1246 110.785 91.3019 110.654V110.542C90.6299 110.542 90.0932 110.355 89.6919 109.982C89.2999 109.609 89.1039 109.109 89.1039 108.484C89.1039 107.672 89.4352 106.967 90.0979 106.37C90.7606 105.763 91.5446 105.46 92.4499 105.46C92.6832 105.46 93.0239 105.507 93.4719 105.6C93.9199 105.693 94.3586 105.74 94.7879 105.74H95.8659L95.7259 106.958L94.6759 106.832C94.7692 107.103 94.8159 107.411 94.8159 107.756C94.8159 108.101 94.7319 108.447 94.5639 108.792C94.4052 109.128 94.2092 109.399 93.9759 109.604C93.7519 109.809 93.5232 109.991 93.2899 110.15C93.0659 110.299 92.8699 110.435 92.7019 110.556C92.5432 110.668 92.4639 110.771 92.4639 110.864C92.4639 111.041 92.6506 111.195 93.0239 111.326C94.0132 111.727 94.6806 112.068 95.0259 112.348C95.3806 112.628 95.5579 112.973 95.5579 113.384C95.5579 114.075 95.2079 114.639 94.5079 115.078C93.8172 115.526 92.9912 115.75 92.0299 115.75C91.0686 115.75 90.3219 115.596 89.7899 115.288C89.2672 114.98 89.0059 114.569 89.0059 114.056ZM93.2339 108.176C93.2339 107.719 93.1312 107.383 92.9259 107.168C92.7206 106.953 92.3986 106.846 91.9599 106.846C91.1106 106.846 90.6859 107.266 90.6859 108.106C90.6859 108.937 91.1386 109.352 92.0439 109.352C92.8372 109.352 93.2339 108.96 93.2339 108.176ZM93.7379 113.594C93.7379 113.426 93.6492 113.267 93.4719 113.118C93.2946 112.978 92.9772 112.81 92.5199 112.614C91.8386 112.801 91.3672 112.973 91.1059 113.132C90.8539 113.291 90.7279 113.487 90.7279 113.72C90.7279 113.953 90.8539 114.14 91.1059 114.28C91.3672 114.429 91.7266 114.504 92.1839 114.504C92.6412 114.504 93.0146 114.42 93.3039 114.252C93.5932 114.084 93.7379 113.865 93.7379 113.594ZM99.1253 111.242C99.3959 111.242 99.6806 111.172 99.9793 111.032C100.278 110.892 100.511 110.752 100.679 110.612L100.931 110.402L101.575 111.186C101.482 111.345 101.337 111.527 101.141 111.732C100.945 111.937 100.745 112.115 100.539 112.264C100.343 112.404 100.077 112.535 99.7413 112.656C99.4146 112.768 99.0739 112.824 98.7193 112.824C97.9633 112.824 97.3473 112.539 96.8713 111.97C96.3953 111.391 96.1573 110.649 96.1573 109.744C96.1573 108.605 96.4886 107.607 97.1513 106.748C97.8139 105.889 98.5886 105.46 99.4753 105.46C100.157 105.46 100.684 105.651 101.057 106.034C101.44 106.417 101.631 106.953 101.631 107.644C101.631 108.055 101.561 108.521 101.421 109.044L101.141 109.338L97.6413 109.66C97.7999 110.715 98.2946 111.242 99.1253 111.242ZM99.1253 106.902C98.7146 106.902 98.3693 107.07 98.0893 107.406C97.8093 107.733 97.6459 108.153 97.5993 108.666L99.9793 108.372C100.007 108.157 100.021 107.98 100.021 107.84C100.021 107.215 99.7226 106.902 99.1253 106.902ZM108.359 103.01C109.255 103.01 109.965 103.215 110.487 103.626C111.01 104.027 111.271 104.569 111.271 105.25C111.271 106.342 110.823 107.103 109.927 107.532C111.141 107.952 111.747 108.727 111.747 109.856C111.747 110.705 111.383 111.415 110.655 111.984C109.927 112.544 109.013 112.824 107.911 112.824C107.333 112.824 106.469 112.773 105.321 112.67L105.489 109.268L105.321 103.01H108.359ZM108.177 108.512H107.043L107.029 109.03L107.127 111.312C107.669 111.359 108.084 111.382 108.373 111.382C108.868 111.382 109.251 111.261 109.521 111.018C109.801 110.766 109.941 110.402 109.941 109.926C109.941 109.45 109.801 109.095 109.521 108.862C109.241 108.629 108.793 108.512 108.177 108.512ZM107.855 104.424H107.169L107.085 107.154H107.995C108.471 107.154 108.835 107.028 109.087 106.776C109.339 106.515 109.465 106.146 109.465 105.67C109.465 104.839 108.929 104.424 107.855 104.424Z" fill="#604A4A" />

                <defs>
                  <pattern id="pattern0_1_13" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_1_13" transform="scale(0.00163399)" />
                  </pattern>
                  <image id="image0_1_13" width="612" height="612" preserveAspectRatio="none" xlinkHref="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QEIRXhpZgAASUkqAAgAAAADAA4BAgC+AAAAMgAAABoBBQABAAAA8AAAABsBBQABAAAA+AAAAAAAAABMYWJvcmF0b3J5IGZyaWRnZSBjYWJpbmV0IHNlbWkgZmxhdCBjb2xvciB2ZWN0b3Igb2JqZWN0LiBJbmR1c3RyaWFsIHJlZnJpZ2VyYXRpb24uIEZ1bGwgc2l6ZWQgaXRlbSBvbiB3aGl0ZS4gVGVjaG5vbG9neSBzaW1wbGUgY2FydG9vbiBzdHlsZSBpbGx1c3RyYXRpb24gZm9yIHdlYiBncmFwaGljIGRlc2lnbiBhbmQgYW5pbWF0aW9uLAEAAAEAAAAsAQAAAQAAAP/hBjlodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgcGhvdG9zaG9wOkNyZWRpdD0iR2V0dHkgSW1hZ2VzIiBHZXR0eUltYWdlc0dJRlQ6QXNzZXRJRD0iMTQxMzk2NzEyOSIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL2xlZ2FsL2xpY2Vuc2UtYWdyZWVtZW50P3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsIiBwbHVzOkRhdGFNaW5pbmc9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYvdm9jYWIvRE1JLVBST0hJQklURUQtRVhDRVBUU0VBUkNIRU5HSU5FSU5ERVhJTkciID4KPGRjOmNyZWF0b3I+PHJkZjpTZXE+PHJkZjpsaT5OYXRhbGlpYSBOZXN0ZXJlbmtvPC9yZGY6bGk+PC9yZGY6U2VxPjwvZGM6Y3JlYXRvcj48ZGM6ZGVzY3JpcHRpb24+PHJkZjpBbHQ+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5MYWJvcmF0b3J5IGZyaWRnZSBjYWJpbmV0IHNlbWkgZmxhdCBjb2xvciB2ZWN0b3Igb2JqZWN0LiBJbmR1c3RyaWFsIHJlZnJpZ2VyYXRpb24uIEZ1bGwgc2l6ZWQgaXRlbSBvbiB3aGl0ZS4gVGVjaG5vbG9neSBzaW1wbGUgY2FydG9vbiBzdHlsZSBpbGx1c3RyYXRpb24gZm9yIHdlYiBncmFwaGljIGRlc2lnbiBhbmQgYW5pbWF0aW9uPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6ZGVzY3JpcHRpb24+CjxwbHVzOkxpY2Vuc29yPjxyZGY6U2VxPjxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPjxwbHVzOkxpY2Vuc29yVVJMPmh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9waG90by9saWNlbnNlLWdtMTQxMzk2NzEyOS0/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmw8L3BsdXM6TGljZW5zb3JVUkw+PC9yZGY6bGk+PC9yZGY6U2VxPjwv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AP8A/wD/AL/4AAAAAAAAAAAAAAAAAAAAAAAH7/8A/wD/AP8A/wD/AP8A/wB/8AAAAAAAAAAAAAAAAAAAAAAAD9//AP8A/wD/AP8A/wD+zv8A4AAAAAAAAAAAAAAAAAAAAAAAH7//AP8A/wD/AP8A/wD4nf8AwAAAAAAAAAAAAAAAAAAAAAAAP3//AP8A/wD/AP8A/wC5+/8AgAAAAAAAAAAAAAAAAAAAAAAAfv8A/wD/AP8A/wD/AP8Ac/f/AAAAAAAAAAAAAAAAAAAAAAAAAP3/AP8A/wD/AP8A/wD+5+/+AAAAAAAAAAAAAAAAAAAAAAAB+/8A/wD/AP8A/wD/AP3P3/wAAAAAAAAAAAAAAAAAAAAAAAP3/wD/AP8A/wD/AP8A+5+/+AAAAAAAAAAAAAAAAAAAAAAAB+//AP8A/wD/AP8A/wD3P3/wAAAAAAAAAAAAAAAAAAAAAAAP3/8A/wD/AP8A/wD/AO5+/wDgAAAAAAAAAAAAAAAAAAAAAAAfv/8A/wD/AP8A/wD/ANz9/wDAAAAAAAAAAAAAAAAAAAAAAAA/f/8A/wD/AP8A/wD/ALn7/wCAAAAAAAAAAAAAAAAAAAAAAAB+/wD/AP8A/wD/AP8A/wBz9/8AAAAAAAAAAAAAAAAAAAAAAAAA/f8A/wD/AP8A/wD/AP7n7/4AAAAAAAAAAAAAAAAAAAAAAAH7/wD/AP8A/wD/AP8A/c/f/AAAAAAAAAAAAAAAAAAAAAAAA/f/AP8A/wD/AP8A/wD7n7/4AAAAAAAAAAAAAAAAAAAAAAAH7/8A/wD/AP8A/wD/APc/f/AAAAAAAAAAAAAAAAAAAAAAAA/f/wD/AP8A/wD/AP8A7n7/AOAAAAAAAAAAAAAAAAAAAAAAAB+//wD/AP8A/wD/AP8A3P3/AMAAAAAAAAAAAAAAAAAAAAAAAD9//wD/AP8A/wD/AP8Aufv/AIAAAAAAAAAAAAAAAAAAAAAAAH7/AP8A/wD/AP8A/wD/AHP3/wAAAAAAAAAAAAAAAAAAAAAAAAD9/wD/AP8A/wD/AP8A/wDM7/4AAAAAAAAAAAAAAAAAAAAAAAH7/wD/AP8A/wD/AP8A/bnf/AAAAAAAAAAAAAAAAAAAAAAAA/f/AP8A/wD/AP8A/wD/AN+/+AAAAAAAAAAAAAAAAAAAAAAAB+//AP8A/wD/AP8A/wD/AP8A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" />
                </defs>
              </svg> */}




            </div>

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
    </ApprovalRequestsContext.Provider>
  );
};
