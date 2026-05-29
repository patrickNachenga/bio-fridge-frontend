import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import showToast from "../../helpers/ToastHelper";
import ReactLoading from "react-loading";
import "animate.css";
import { FridgeContext } from "../../utils/context";
import { useParams } from "react-router-dom";
import usePagination from "../../hooks/usePagination";
import ReactPaginate from "react-paginate";
import { formatDate } from "../../helpers/DateFormater";
import BlockModal from "./BlockModal";
import AccordionContainer from "../../components/accordion/AccordionContainer";
import Select from "react-select";
import IconSvg from "./fridge_svg";
import { getPercentageColor } from "../../helpers/PercentageColorHelper";
import { getFridges } from "./Queries";
import { useNavigate } from "react-router-dom";
import FridgeModal from "./Modal";
import TrayVisualization from "../../components/fridge/TrayVisualization";

export const FridgeBlockPage = () => {
  const pageSizeData = [5, 10, 20, 50, 70, 100];
  const navigate = useNavigate();
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loadingBlocks, setLoadingBlocks] = useState(true);

  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [selectedFridge, setSelectedFridge] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        uid: uid,
      });
      if (result.status === 200 || result.status === 8000) {
        setSelectedFridge(result.data);
      } else {
        setError(true);
        showToast("No Fridge Found", "warning", "Fetch Completed");
      }
    } catch (err) {
      setError(true);
      showToast("Unable to Fetch Fridge", "warning", "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      handleFetchData();
    }, 1000);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchQuery, pageSize, currentPage]);

  return (
    <FridgeContext.Provider
      value={{
        debounceTimeout,
        setDebounceTimeout,
        handleFetchData,
        selectedFridge,
        setSelectedFridge,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 className="py-3 mb-4">
          <span className="text-muted fw-light">
            Home /{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/fridges`)}
            >
              {" "}
              Fridges{" "}
            </span>
            /
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/fridges/open/${selectedFridge?.uid}`)}
            >
              {" "}
              {selectedFridge?.name}{" "}
            </span>
            /
          </span>
          Block / View
        </h4>
      </div>

      <div className="content-wrapper">
        <div className="animate__animated animate__fadeInUp animate__faster">
          {loading ? (
            <div className="d-flex justify-content-between align-items-center">
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
            </div>
          ) : error || selectedFridge === null ? (
            // error || directory.length === 0
            <div className="alert alert-info" role="alert">
              <div className="alert-body text-center">
                <p className="mb-0">
                  Sorry! Unable to get Fridges Details Please Contanct System
                  Administrator{" "}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-grow-1 container-p-y container-fluid">
              <div className="row">
                <div className="col-xl-3 col-lg-4 order-1 order-md-0">
                  <div className="card mb-6 animate__animated animate__fadeInLeft animate__faster">
                    <div className="card-body pt-12">
                      <div className="user-avatar-section">
                        <div className=" d-flex align-items-center flex-column">
                          <IconSvg
                            key={selectedFridge.uid}
                            label={selectedFridge.name}
                            block={selectedFridge.block_number}
                            sample={selectedFridge.sample_number}
                            capacity={selectedFridge.capacity}
                            percent={(
                              (selectedFridge.sample_number /
                                selectedFridge.capacity) *
                              100
                            ).toFixed(2)}
                            color={getPercentageColor(
                              (
                                (selectedFridge.sample_number /
                                  selectedFridge.capacity) *
                                100
                              ).toFixed(2)
                            )}
                          />
                          <h5>
                            {selectedFridge?.name} ({selectedFridge?.code})
                          </h5>
                        </div>
                      </div>
                      <div className="info-container border-top mt-3 ">
                        <div
                          className="button-wrapper mt-1"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            width: "100%",
                          }}
                        >
                          <small className="text-muted">Fridge Status</small>
                          {selectedFridge?.status === "NEW" ? (
                            <span className="ms-1 badge bg-label-info">
                              {selectedFridge?.status}
                            </span>
                          ) : selectedFridge?.status === "ACTIVE" ? (
                            <span className="ms-1 badge bg-label-success">
                              {selectedFridge.status}
                            </span>
                          ) : (
                            <span className="ms-1 badge bg-label-danger">
                              {selectedFridge?.status}
                            </span>
                          )}
                        </div>

                        <div className="demo-inline-spacing mt-3 ">
                          <h5 className="pb-2 mt-3 text-muted">
                            Fridge Details
                          </h5>
                          <ul className="list-group">
                            <li
                              className="list-group-item d-flex align-items-center"
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <span style={{ minWidth: "90px" }}>
                                <i className="bx bx-box me-2"></i>
                                <strong>Model </strong>&nbsp;:&nbsp;
                              </span>
                              <span>{selectedFridge.model}</span>
                            </li>
                            <li
                              className="list-group-item d-flex align-items-center"
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <span style={{ minWidth: "90px" }}>
                                <i className="bx bx-box me-2"></i>
                                <strong>Serial Number </strong>&nbsp;:&nbsp;
                              </span>
                              <span>{selectedFridge.serial_number}</span>
                            </li>
                            <li
                              className="list-group-item d-flex align-items-center"
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <span style={{ minWidth: "90px" }}>
                                <i className="bx bxs-hot me-2"></i>
                                <strong>Min Temparature </strong>&nbsp;:&nbsp;
                              </span>
                              <span>
                                {selectedFridge.minimum_temperature} (&#176;C)
                              </span>
                            </li>
                            <li
                              className="list-group-item d-flex align-items-center"
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <span style={{ minWidth: "90px" }}>
                                <i className="bx bxs-hot me-2"></i>
                                <strong>Max Temperature </strong>&nbsp;:&nbsp;
                              </span>
                              <span>
                                {selectedFridge.maximum_temperature} (&#176;C)
                              </span>
                            </li>
                            <li
                              className="list-group-item d-flex align-items-center"
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <span style={{ minWidth: "90px" }}>
                                <i className="bx bx-calendar me-2"></i>
                                <strong>Since </strong>&nbsp;:&nbsp;
                              </span>
                              <span>
                                {new Date(
                                  selectedFridge.created_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-9 col-lg-8 order-0 order-md-0">
                   <div className="card">
                     <div className="card-body animate__animated animate__fadeInUp animate__faster">
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
                             <h6 className="text-muted">Fetching Block Data</h6>
                           </center>
                         </div>
                       ) : (
                         <>
                           {/* Tray Visualization */}
                           <TrayVisualization
                             blockData={{
                               name: `${selectedFridge.name} - Block Visualization`,
                               sample_number: selectedFridge.sample_number,
                               capacity: selectedFridge.capacity,
                             }}
                             onTrayClick={(index) => {
                               console.log("Tray clicked:", index);
                             }}
                           />

                           {/* Traditional Table View */}
                           <div className="table-responsive mb-4 mt-4">
                             <div className="d-flex justify-content-between align-items-center card-header mb-4">
                               <h5 className="">
                                 Detailed Tray List for {selectedFridge.name}
                               </h5>
                             </div>
                             <table className="table table-hover table-align-middle mb-0 table-bordered">
                               <thead style={{ backgroundColor: "#f1f1f1" }}>
                                 <tr>
                                   <th style={{ width: "50px" }}>S/N</th>
                                   <th>Tray</th>
                                   <th style={{ width: "120px" }}>Row</th>
                                   <th style={{ width: "120px" }}>Partitions</th>
                                   <th style={{ width: "150px" }}>
                                     Storage&nbsp;Structure
                                   </th>
                                   <th style={{ width: "100px" }}>Status</th>
                                   <th style={{ width: "60px" }}></th>
                                 </tr>
                               </thead>
                               <tbody className="table-border-bottom-0">
                                 <tr key={"11112211"}>
                                   <td>1</td>
                                   <td className="fw-medium">Tray #08</td>
                                   <td className="fw-medium text-center">1</td>
                                   <td className="fw-medium">4</td>
                                   <td
                                     className="fw-medium text-center"
                                     style={{ width: "180px" }}
                                   >
                                     <div className="d-flex flex-column">
                                       <span className="text-center mb-1">
                                         50 / 200
                                       </span>
                                       <div className="progress">
                                         <div
                                           className="progress-bar"
                                           role="progressbar"
                                           style={{
                                             width: `25%`,
                                             backgroundColor:
                                               getPercentageColor(25),
                                           }}
                                           aria-valuenow={25}
                                           aria-valuemin="0"
                                           aria-valuemax="100"
                                         >
                                           25%
                                         </div>
                                       </div>
                                     </div>
                                   </td>
                                   <td>
                                     <span
                                       className={
                                         true
                                           ? "badge bg-label-success me-1"
                                           : "badge bg-label-danger me-1"
                                       }
                                     >
                                       {true ? "Available" : "Full"}
                                     </span>
                                   </td>
                                   <td className="text-center">
                                     <button
                                       aria-label="Click me"
                                       type="button"
                                       className="btn p-0 dropdown-toggle hide-arrow me-4 pointer"
                                       onClick={() =>
                                         navigate(
                                           `/fridges/block/:uid/:block_uid`
                                         )
                                       }
                                     >
                                       view &nbsp;
                                       <i className="bx bx-right-arrow-alt me-1"></i>
                                     </button>
                                   </td>
                                 </tr>
                               </tbody>
                             </table>
                           </div>
                         </>
                       )}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <FridgeModal loadOnlyModal={true} />
      <BlockModal />
    </FridgeContext.Provider>
  );
};
