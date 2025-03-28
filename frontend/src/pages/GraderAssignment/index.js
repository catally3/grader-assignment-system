import styled from "@emotion/styled";
import Layout from "../../layouts/Layout.js";
import Header from "../../layouts/Header.js";
import { useState } from "react"; // delete, add, search states

// Candidate Management
const Title = styled.div`
  font-size: x-large;
  font-weight: bold;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  margin-top: 20px;  
`;

const Box = styled.div`
  display: flex;
  width: 1140px;
  background-color: white;
  border-radius: 12px; // round corners
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  color: #333; // text color
  flex-direction: column; // stacks children vertically
  padding: 14px; // internal spacing
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center; // vertically
  justify-content: space-between;
  width: 100%; 
  padding: 10px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.button`
  display: flex;
  justify-content: center; // horizontal text
  align-items: center; // vertical text
  border-radius: 12px;
  font-size: small;  
  gap: 10px;
`;

const AddButton = styled(ButtonContainer)`
  color: rgb(114, 117, 121);
  background-color: rgb(237, 240, 243);
  display: flex;
  width: 200px;
  height: 35px;
  border: 1px solid #ccc; 
  font-weight: bold;
  &:hover {
    background-color: rgb(224, 226, 230);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 350px;
`;

const ModalTitle = styled.h3`
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const ModalButton = styled.button`
  width: 48%;
`;

const DeleteButton = styled(ButtonContainer)`
  color: rgb(255, 255, 255);
  background-color: rgb(17, 16, 16);
  display: flex;
  width: 80px;
  height: 35px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);  
  &:hover {
    background-color: rgb(59, 57, 57);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderText = styled.div`
  font-size: medium;
  font-weight: normal;
  padding: 10px;
  jusitify-content: flex-end;
`;

const SearchBox = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 150px; 
`;

const ColumnTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  padding: 10px 0;
  background-color: rgb(224, 221, 221); 
`;

const ColumnTitleText = styled.div`
  flex: 1;
  text-align: center;  
  padding: 0 10px;
  color: #333;
  font-size: medium;
  font-weight: normal;
`;

// hover for details
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  
  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%; 
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  padding: 15px 0;
  font-size: small;
  font-weight: normal;
  border-bottom: 1px solid #ccc; 

  &:last-child {
    border-bottom: none; 
  }
`;

const Column = styled.div`
  flex: 1;
  text-align: center;  
  padding: 0 10px;
`;

const GraderAssignment = () => {
  const[data, setData] = useState([
    {candidateID: '12341', candidateName: 'John Smith (jxs190043)', number: '4302', name: 'CS', section: '501', professor: 'John Smith'},
    {candidateID: null, candidateName: 'John Doe (jxd190043)', number: '4301', name: 'CS', section: '502', professor: 'John Doe'},
    {candidateID: '12341', candidateName: 'Jane Smith (jxs190042)', number: '4302', name: 'CS', section: '501', professor: null},
    {candidateID: '12343', candidateName: 'John Doe (jxd190042)', number: '4303', name: 'CS', section: '504', professor: 'John Smith'},
    {candidateID: '12344', candidateName: null, number: null, name: 'CS', section: '501', professor: 'John Smith'},
    {candidateID: '12345', candidateName: 'Gaby Salazar (gxs190043)', number: null, name: 'CS', section: '501', professor: 'John Smith'},
  ]); 
  
  // states used for deletion of candidate
  const[deleteMode, setDeleteMode] = useState(false); // deleteMode: true or false
  const[selected, setSelected] = useState([]); // array of candidate ID's selected for deletion

  // state used for search
  const [searchTerm, setSearchTerm] = useState(""); 

  // states used to add candidate
  const [showModal, setShowModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    candidateID: "",
    candidateName: "",
    number: "",
    name: "CS",
    section: "",
    professor: ""
  });

  // toggles between normal mode and delete mode; selection is resetted after switching to normal mode
  const toggleDeleteMode = () => { 
    setDeleteMode(!deleteMode);
    setSelected([]); 
  };

  // when user checks/unchecks a checkbox, id is either added or removed from selected
  // note: if entries have the same candidate id's, selecting one will select the other(s)
  const handleCheckboxChange = (id) => { 
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // user confirmed deletion, DELETE!
  const handleDelete = () => { 
    setData((prevData) => prevData.filter((row) => !selected.includes(row.candidateID)));
    setDeleteMode(false);
    setSelected([]);
  };

  // get user input (search term) and convert it to lowercase for search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); 
  };
  
  // update newCandidate when inputting
  const handleInputChange = (event) => {
    setNewCandidate((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };
  
  // when add button is clicked, 
  const handleAddCandidate = () => {
    if (!newCandidate.candidateID || !newCandidate.candidateName) {
      alert("Candidate ID and Name are required!"); // prevents adding if
      return;
    }
  
    setData((prevData) => [...prevData, newCandidate]); // adds new candidates correctly to form 
    setShowModal(false);
    setNewCandidate({
      candidateID: "",
      candidateName: "",
      number: "",
      name: "CS",
      section: "",
      professor: ""
    });
  };
  
  // search data array by seeing which entry matches the search entry 
  const filteredData = data.filter((row) =>
    row.candidateID?.toLowerCase().includes(searchTerm) ||
    row.candidateName?.toLowerCase().includes(searchTerm) ||
    row.number?.toLowerCase().includes(searchTerm) ||
    row.professor?.toLowerCase().includes(searchTerm)
  );

  return (
    <Layout>
      <Title>Candidate Management</Title>
      <BoxContainer>
        <Box>
          <HeaderContainer>
            <ButtonContainer>
            <AddButton onClick={() => setShowModal(true)}>+ Add Candidate</AddButton>
            <DeleteButton onClick={toggleDeleteMode}> {/*when button is clicked, toggle between modes*/}
                {deleteMode ? "Cancel" : "Delete"} {/*if deleteMode, then Cancel, else Delete Candidate*/}
              </DeleteButton>
              {/*if deleteMode, then display Confirm, and when clicked Deleted*/}
              {deleteMode && ( 
                <DeleteButton onClick={handleDelete}>Confirm Delete</DeleteButton> 
              )}
            </ButtonContainer>
            <SearchContainer>
              <HeaderText>Search:</HeaderText>
              <SearchBox
                type="text"
                placeholder="Search..."
                value={searchTerm} // bind input to searchTerm
                onChange={handleSearchChange} // state updated everytime user inputs
              />
            </SearchContainer>
          </HeaderContainer>
          <ColumnTitle>
            {deleteMode && <ColumnTitleText>Select</ColumnTitleText>} {/*if deleteMode, then display column for Select*/}
            <ColumnTitleText>Candidate ID</ColumnTitleText>
            <ColumnTitleText>Candidate Name</ColumnTitleText>
            <ColumnTitleText>Course Number</ColumnTitleText>
            <ColumnTitleText>Professor Name</ColumnTitleText>
          </ColumnTitle>
          {/*displays rows of table by iterating through data array*/}
          {filteredData.map((row, index) => ( 
            <Row key={index}>
              {deleteMode && ( 
                <Column>
                  <input
                  type="checkbox"
                  checked={selected.includes(row.candidateID)}
                  onChange={() => handleCheckboxChange(row.candidateID)}
                />
                </Column>
              )}
              <Column>{row.candidateID || 'N/A'}</Column>
              <Column>{row.candidateName || 'N/A'}</Column>
              <Column>
                {row.number?(
                  <TooltipContainer>
                    {row.number}{}
                    <Tooltip className="tooltip">
                      {row.name} {row.number}.{row.section}
                    </Tooltip>
                  </TooltipContainer>
                ):(
                  'N/A'
                )}
              </Column>
              <Column>{row.professor || 'N/A'}</Column>
            </Row>
          ))}
        </Box>
      </BoxContainer>
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Add New Candidate</ModalTitle>
            <Input
              name="candidateID"
              placeholder="Candidate ID"
              value={newCandidate.candidateID} 
              onChange={handleInputChange} 
            />
            <Input
              name="candidateName"
              placeholder="Candidate Name"
              value={newCandidate.candidateName} 
              onChange={handleInputChange} 
            />
            <Input
              name="number"
              placeholder="Course Number"
              value={newCandidate.number} 
              onChange={handleInputChange} 
            />
            <Input
              name="section"
              placeholder="Section"
              value={newCandidate.section} 
              onChange={handleInputChange} 
            />
            <Input
              name="professor"
              placeholder="Professor Name"
              value={newCandidate.professor} 
              onChange={handleInputChange} 
            />
            <ModalButtonContainer>
              <ModalButton onClick={handleAddCandidate}>Add</ModalButton>
              <ModalButton onClick={() => setShowModal(false)}>Cancel</ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default GraderAssignment;

/*
Delete Candidate Process:
  - There are 2 modes, normal mode and delete mode. You switched between by the Delete Candidate and Cancel button
    - Normal Mode: Default, you just see the list of candidates
    - Delete Mode: Checkboxes appear next to the each candidate entry 
      - Checking Box: candidate id is added to selected array
      - Unchecking Box: candidate id is removed from selected
    - Confirm Deletion: When user confirms, candidates ids in slected are removed from data array
*/