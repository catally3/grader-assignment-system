import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import React from "react";
import styled from "@emotion/styled";
import DropdownButton from "./Common/DropdownButton";

/**
 * Exports JSON data to Excel file.
 *
 * @param {Array} data - Array of data objects to export
 * @param {string} filename - Name of the exported Excel file (without extension)
 * @param {Function} [filterFn] - Optional filter function to transform or filter data before export
 */

/**
 * ExportDropdown - DropdownButton wrapper for Excel export options
 *
 * @param {Object} props
 * @param {Array} props.data - Full data array
 * @param {Array} props.filteredData - Filtered data (optional)
 */

export const ExcelExportButton = ({ data, filteredData }) => {
  const exportToExcel = (data, filename, filterFn) => {
    const dataToExport = filterFn ? data.filter(filterFn) : data;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, `${filename}.xlsx`);
  };

  return (
    <DropdownButton
      label="Export"
      options={[
        {
          label: "Export Assignments (XLSX)",
          onClick: () => exportToExcel(data, "All_Assignment_Data"),
        },
        {
          label: "Export Modified Assignment (XLSX)",
          onClick: () =>
            exportToExcel(
              data,
              "Modified_Assignment_Data",
              (item) => item.updated === true
            ),
        },
        {
          label: "Export Filtered (XLSX)",
          onClick: () => exportToExcel(filteredData, "Filtered_Data"),
        },
      ]}
    />
  );
};

const Button = styled.button`
  padding: 8px 16px;
  background-color: #f87e03;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #d96d02;
  }
`;
