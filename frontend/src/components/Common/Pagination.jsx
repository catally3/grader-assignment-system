const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisible = 5;
  const currentGroup = Math.floor((currentPage - 1) / maxVisible);
  const startPage = currentGroup * maxVisible + 1;
  const endPage = Math.min(startPage + maxVisible - 1, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: currentPage === num ? "#ff9d3a" : "white",
            color: currentPage === num ? "white" : "#333",
            border: "1px solid #ccc",
            fontWeight: currentPage === num ? "bold" : "normal",
          }}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
