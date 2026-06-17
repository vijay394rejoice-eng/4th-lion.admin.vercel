"use client";
import React, { useState, useEffect } from "react";
import styles from "./kycRequestsTable.module.scss";
import DataTable from "@/components/dataTable";
import { getKYCRequests } from "@/services/kyc";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    // Format: DD-MM-YYYY | HH:MM AM/PM
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} | ${strHours}:${minutes} ${ampm}`;
  } catch (error) {
    return dateString;
  }
};

export default function KycRequestsTable() {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pageSize = 10;

  const fetchKycRequests = async (page) => {
    setIsLoading(true);
    try {
      const res = await getKYCRequests({ page, limit: pageSize });
      if (res && res.status === 1) {
        setData(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
      }
    } catch (err) {
      console.error("Failed to load KYC requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKycRequests(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate 10 skeleton rows when loading to align columns nicely
  const skeletonData = Array.from({ length: pageSize }, (_, index) => ({
    id: `skeleton-${index}`,
    isSkeleton: true,
  }));

  const columns = [
    { 
      header: "Created At", 
      accessor: "created_at", 
      width: "18%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        formatDate(row.created_at)
      )
    },
    { 
      header: "User ID", 
      accessor: "user_id", 
      width: "20%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        <span className={styles.userIdText} title={row.user_id}>
          {row.user_id}
        </span>
      )
    },
    { 
      header: "Role", 
      accessor: "role", 
      width: "10%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text} ${styles.short}`} />
      ) : (
        <span className={styles.roleText}>{row.role}</span>
      )
    },
    { 
      header: "Status", 
      accessor: "status", 
      width: "12%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.badge}`} />
      ) : (
        <span className={`${styles.statusBadge} ${styles[row.status?.toLowerCase()] || ''}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: "Remarks", 
      accessor: "remarks", 
      width: "14%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.text}`} />
      ) : (
        row.remarks || "-"
      )
    },
    {
      header: "Action",
      width: "8%",
      cell: (row) => row.isSkeleton ? (
        <span className={`${styles.skeleton} ${styles.badge}`} />
      ) : (
        <button className={styles.viewBtn} onClick={() => setSelectedRequest(row)}>
          View
        </button>
      ),
    },
  ];

  const tableData = isLoading ? skeletonData : data;

  return (
    <>
      <div className={styles.tableContainer}>
        <DataTable 
        columns={columns} 
        data={tableData} 
        pageSize={pageSize} 
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </div>

      {/* KYC Detail Viewer Modal */}
      {selectedRequest && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedRequest(null)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>KYC Request Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedRequest(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {/* Section 1: User & Info */}
              <div className={styles.detailSection}>
                <h4>Request Information</h4>
                <div className={styles.gridInfo}>
                  <div className={styles.infoItem}>
                    <span>Request ID</span>
                    <span>{selectedRequest.id}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span>User ID</span>
                    <span>{selectedRequest.user_id}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span>User Role</span>
                    <span className={styles.roleText}>{selectedRequest.role}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Status</span>
                    <div>
                      <span className={`${styles.statusBadge} ${styles[selectedRequest.status?.toLowerCase()] || ''}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Date Submitted</span>
                    <span>{formatDate(selectedRequest.created_at)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Last Updated</span>
                    <span>{formatDate(selectedRequest.updated_at)}</span>
                  </div>
                  {selectedRequest.remarks && (
                    <div className={styles.infoItem} style={{ gridColumn: 'span 2' }}>
                      <span>Remarks</span>
                      <span>{selectedRequest.remarks}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Documents */}
              <div className={styles.detailSection}>
                <h4>Uploaded Documents ({selectedRequest.documents?.length || 0})</h4>
                <div className={styles.documentGrid}>
                  {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                    selectedRequest.documents.map((doc) => {
                      const isImage = doc.mime_type?.startsWith('image/');
                      return (
                        <div key={doc.id} className={styles.documentCard}>
                          <div className={styles.docImageWrapper}>
                            {isImage ? (
                              <img src={doc.file_url} alt={doc.document_name} />
                            ) : (
                              <div className={styles.docFallback}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                <span>{doc.mime_type || 'Document'}</span>
                              </div>
                            )}
                          </div>
                          <div className={styles.docMeta}>
                            <p className={styles.docTitle} title={doc.document_name && doc.document_name !== "string" ? doc.document_name : doc.document_category?.replace('_', ' ')}>
                              {doc.document_name && doc.document_name !== "string" ? doc.document_name : doc.document_category?.replace('_', ' ')}
                            </p>
                            <div className={styles.docSub}>
                              <span style={{ textTransform: 'capitalize' }}>
                                {doc.document_category?.replace('_', ' ').toLowerCase()} ({doc.document_side?.toLowerCase()})
                              </span>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <a 
                                href={doc.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.viewDocBtn}
                              >
                                Open Full Document
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '24px', color: '#64748B' }}>
                      No documents attached.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.closeBtnPrimary} onClick={() => setSelectedRequest(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
