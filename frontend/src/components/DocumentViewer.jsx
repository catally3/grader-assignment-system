import React, { useState } from "react";
import styled from "@emotion/styled";

import PencilGrIcon from "../assets/icons/icon_pencil_green.svg";
import PencilOgIcon from "../assets/icons/icon_pencil_orange.svg";
import PencilYwIcon from "../assets/icons/icon_pencil_yellow.svg";
import PencilGyIcon from "../assets/icons/icon_pencil_gray.svg";

import PDFViewer from "./PDFViewer";

const highlightTabs = [
  {
    icon: PencilOgIcon,
    label: "Skill",
    color: "rgba(255, 227, 207, 1)",
  },
  {
    icon: PencilYwIcon,
    label: "Major",
    color: "rgba(255, 252, 191, 1)",
  },
  {
    icon: PencilGrIcon,
    label: "Experience",
    color: "rgba(224, 255, 209, 1)",
  },
];

function DocumentViewer({
  documentIcon,
  pdfUrl,
  wordToHighlight,
  matchingKeyword,
  fileName,
}) {
  const [activeTabs, setActiveTabs] = useState([
    "Skill",
    "Major",
    "Experience",
  ]);

  // Tab Handler
  const handleTabClick = (index) => {
    setActiveTabs((prev) => {
      if (prev.includes(index)) {
        // Remove already active index
        return prev.filter((tabIndex) => tabIndex !== index);
      } else {
        // Add it if it's inactive
        return [...prev, index];
      }
    });
  };

  // PDF Download
  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Filter matching keyword following active tab (optional)
  const filteredMatchingKeyword = activeTabs.length
    ? Object.fromEntries(
        Object.entries(matchingKeyword).filter((_, index) =>
          activeTabs.includes(index)
        )
      )
    : matchingKeyword; // if noting chosen filtering

  return (
    <Container>
      <DocumentHeader>
        <DocumentTitle>
          <Title>Document (CVS, PDF)</Title>
          <DocumentIcon
            src={documentIcon}
            alt="icon"
            onClick={handleDownload}
          />
        </DocumentTitle>
        <TabsContainer>
          {highlightTabs.map((tab, index) => (
            <TabPill
              key={index}
              $isActive={activeTabs.includes(tab.label)} // array check
              $bgColor={tab.color}
              onClick={() => handleTabClick(tab.label)}
            >
              <TabIcon
                src={activeTabs.includes(tab.label) ? tab.icon : PencilGyIcon}
                alt="tab icon"
              />
              <TabLabel>{tab.label}</TabLabel>
            </TabPill>
          ))}
        </TabsContainer>
      </DocumentHeader>
      <PDFViewer
        pdfUrl={pdfUrl}
        highlightWord={wordToHighlight}
        matchingKeyword={filteredMatchingKeyword} // filtering keyword
        activeTabs={activeTabs}
      />
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  margin-top: 20px;
  width: 100%;
  gap: 8px;
  flex-wrap: wrap;
`;

const DocumentHeader = styled.div`
  flex-direction: column;
`;

const DocumentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

const Title = styled.div`
  color: #6f727a;
`;

const DocumentIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 24px;
  border-radius: 10px;
  flex-shrink: 0;
  cursor: pointer;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-top: 8px;
  max-width: 100%;
  align-items: flex-start;
  gap: 6px;
  font-weight: 500;
  justify-content: flex-start;
`;

const TabPill = styled.button`
  border: none;
  border-radius: 4px;
  background-color: ${(props) =>
    props.$isActive ? props.$bgColor : "rgba(226, 232, 240, 1)"};
  display: flex;
  padding: 4px 16px;
  align-items: center;
  gap: 4px;
  justify-content: flex-start;
  cursor: pointer;
  ${(props) =>
    props.$isActive &&
    `
  `}
`;

const TabIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 18px;
  align-self: stretch;
  margin: auto 0;
  flex-shrink: 0;
`;

const TabLabel = styled.span`
  align-self: stretch;
  margin: auto 0;
`;

export default DocumentViewer;
