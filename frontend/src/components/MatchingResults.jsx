import React from "react";
import styled from "@emotion/styled";
import Pill from "./Common/Pill";

function MatchingResults({ matchCount, skills }) {
  return (
    <Container>
      <SummaryLabel>Matching Summary</SummaryLabel>
      <SkillsContainer>
        <MatchCount>{matchCount} Matches</MatchCount>
        {skills.map((skill, index) => (
          <Pill key={index} text={skill} />
        ))}
      </SkillsContainer>
    </Container>
  );
}

const Container = styled.section`
  margin-top: 20px;
  width: 100%;

  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid var(--Secondary-Gray-2, #e5e5e5);
  border-bottom: 1px solid var(--Secondary-Gray-2, #e5e5e5);
`;

const SummaryLabel = styled.div`
  color: #6f727a;
  font-size: small;
  font-weight: 600;
  margin-bottom: 10px;
`;

const SkillsContainer = styled.div`
  display: flex;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const MatchCount = styled.span`
  color: rgba(248, 126, 3, 1);
  font-size: medium;
  font-weight: 600;
  align-self: stretch;
  margin: auto 0;
`;

const SkillPill = styled.div`
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid var(--Secondary-Gray-2, #e0e2e7);
  background-color: #fff;
  align-self: stretch;
  display: flex;
  margin: auto 0;
  padding: 2px 10px;
  gap: 6px;
  line-height: 2;
`;

const SkillIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 16px;
  fill: #232325;
  align-self: stretch;
  margin: auto 0;
  flex-shrink: 0;
`;

const SkillText = styled.span`
  align-self: stretch;
  margin: auto 0;
`;

export default MatchingResults;
