import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styled from "@emotion/styled";

import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // add style
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfContainer = styled.div`
  max-width: 800px;
  min-width: 100%;
  position: relative;
  margin: 0 auto;
  border: 1px solid #e8e8e8;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const TopContainer = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const PageButton = styled.div`
  border: 1px solid #e8e8e8;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
`;

const PDFViewer = ({ pdfUrl, matchingKeyword, activeTabs }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textContent, setTextContent] = useState(null);
  const [pageScale, setPageScale] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);

  // const matchingKeyword = {
  //   skill: ["Python", "Web"],
  //   major: ["Computer Science", "Engineer"],
  //   experience: "company",
  // };

  const colorMap = {
    major: "rgba(255, 255, 0, 0.3)",
    skill: "rgba(255, 115, 0, 0.181)",
    experience: "rgba(0, 255, 0, 0.3)",
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = async (page) => {
    const textContent = await page.getTextContent();
    setTextContent(textContent);
    const viewport = page.getViewport({ scale: 1 });
    setPageHeight(viewport.height);
    setPageScale(page.scale || 1);
  };

  const renderHighlights = () => {
    if (
      !textContent ||
      !matchingKeyword ||
      !activeTabs ||
      activeTabs.length === 0
    )
      return null;

    const highlights = [];
    textContent.items.forEach((item, index) => {
      const text = item.str.toLowerCase();

      // Filters only activeTabs
      Object?.entries(matchingKeyword)
        ?.filter(([category]) =>
          activeTabs.some((tab) => tab.toLowerCase() === category)
        )
        ?.forEach(([category, words]) => {
          const wordList = Array.isArray(words) ? words : [words];

          wordList?.forEach((word) => {
            if (
              typeof word === "string" &&
              word &&
              text?.includes(word.toLowerCase())
            ) {
              const { transform, width, height } = item;
              const [scaleX, , , scaleY, x, y] = transform;

              const scaledX = x * pageScale;
              const scaledY = (pageHeight - y - height) * pageScale; // Y scale info
              const scaledWidth = width * pageScale;
              const scaledHeight = height * pageScale;

              highlights?.push(
                <div
                  key={`${index}-${category}-${word}`}
                  style={{
                    position: "absolute",
                    left: `${scaledX}px`,
                    top: `${scaledY}px`,
                    backgroundColor:
                      colorMap[category] || "rgba(255, 255, 0, 0.3)",
                    height: `${scaledHeight}px`,
                    width: `${scaledWidth}px`,
                    pointerEvents: "none",
                  }}
                />
              );
            }
          });
        });
    });
    return highlights;
  };

  return (
    <PdfContainer>
      <TopContainer>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PageButton
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            {`< Previous`}
          </PageButton>
          <div style={{ padding: "0px 10px", lineHeight: "2" }}>
            Page {pageNumber} / {numPages || "Loading..."}
          </div>
          <PageButton
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
            disabled={pageNumber >= numPages}
          >
            {`Next >`}
          </PageButton>
        </div>
      </TopContainer>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error("Failed to load PDF:", error)}
      >
        <Page
          pageNumber={pageNumber}
          onLoadSuccess={onPageLoadSuccess}
          renderTextLayer={true} // text layer (making image to text)
          renderAnnotationLayer={false}
        >
          {renderHighlights()}
        </Page>
      </Document>
    </PdfContainer>
  );
};

export default PDFViewer;
