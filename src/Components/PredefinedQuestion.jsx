import React, { memo, useEffect, useState } from 'react'
import { Button, IconButton, Radio, TextField } from '@mui/material'
import CreatableSelect from 'react-select/creatable'
import Label from './Label';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DataGrid } from '@mui/x-data-grid';
import { useContext } from 'react';
import { MasterDataContext } from './CandidateTestCreation';
import { ValidationContext } from './CandidateTestForm';
import InfoIcon from '@mui/icons-material/Info';
import { handleInputChange } from '../handlers/InputHandlers';
import axios from 'axios';
import AddNewQuestion from './AddNewQuestion';


let technologies = [
  { label: "Python", value: "Python" },
  { label: "Java", value: "java" },
  { label: "React", value: "react" },
  { label: "Php", value: "php" }
];

const columns = [
  {
    field: 'questionTitle',
    headerName: 'Question Title',
    width: 150,
    // editable: true,
  },
  {
    field: 'questionLevel',
    headerName: 'Question Level',
    type: 'number',
    width: 80,
  },
  {
    field: 'technology',
    headerName: 'Technology',
    width: 110,
  },
  {
    field: 'questionType',
    headerName: 'Question Type',
    width: 110,
  },
];

const PredefinedQuestion = () => {


  const {masterData, setMasterData} = useContext(MasterDataContext);

  const {formUpdationKey, validation, setValidation, tableRows, setTableRows, setShowAddNewQuestionForm, showAddNewQuestionForm, fetchRows} = useContext(ValidationContext);
  
  

  const [selectedTechAndType, setSelectedTechAndType] = useState({technology:[],questionType:[]});

  if(!validation.no_of_random_question.isValid) return;

  if(Number(masterData.test_types[formUpdationKey].random_questions.no_of_random_question) === Number(masterData.test_types[formUpdationKey].total_no_question) ) return;

  const handleAutoChecked = (obj) =>
  {
    if(obj?.selectRow && fetchRows.current)
    {
      for(let i=0; i<Number(masterData.test_types[formUpdationKey].predefined_questions.no_of_predefined_questions); i++)
        obj.selectRow(i);
      fetchRows.current = false; 
    }

  }

  const handleSearch = () =>
  {
    let {technology, questionType} = (selectedTechAndType)
    let techArr = technology.map(element=>element.value);
    let typeArr = questionType.map(element=>element.value);

    if(!(techArr.length && typeArr.length))
      return;

    let url = `http://localhost:8080/technologyQuestions?`;
    techArr.map(tech=>url+='technology='+tech+'&')

    axios.get(url)
    .then(({data})=>
    {
      let i=-1;
      let res = data.map(({data:questionArr, technology})=>{
        let name = technology;
        return questionArr.map((element)=>
        {
          return {
            id: ++i,
            questionTitle:element.question,
            questionLevel:1,
            technology:name[0].toUpperCase()+name.slice(1,),
            questionType: element.questionType === undefined ? 'mcq' : element.questionType 
          }

        })

      })

      let allData = res.reduce((acc, item)=>acc=[...acc, ...item],[]);

      typeArr = typeArr.map(tech=>tech.toLowerCase());
      allData = (allData.filter(data=>typeArr.includes(data.questionType)))

      setTableRows(allData.reverse());

    })

  }

  const handleCellClick = (value) =>
  {

      if(Array.isArray(value))
      {
        setMasterData((pre)=>({...pre, test_types:{...pre.test_types, [formUpdationKey]: {...pre.test_types[formUpdationKey], predefined_questions:{...pre.test_types[formUpdationKey].predefined_questions, already_selected_question: value}}}}));
      }
      else
      {
        if(masterData.test_types[formUpdationKey].predefined_questions.already_selected_question.includes(value.id))
        {
          let copySelectedAnswers = masterData.test_types[formUpdationKey].predefined_questions.already_selected_question;
          let ind = copySelectedAnswers.indexOf(value.id);
          copySelectedAnswers.splice(ind,1);
          setMasterData((pre)=>({...pre, test_types:{...pre.test_types, [formUpdationKey]: {...pre.test_types[formUpdationKey], predefined_questions:{...pre.test_types[formUpdationKey].predefined_questions, already_selected_question:copySelectedAnswers}}}}));
        }
        else
          setMasterData((pre)=>({...pre, test_types:{...pre.test_types, [formUpdationKey]: {...pre.test_types[formUpdationKey], predefined_questions:{...pre.test_types[formUpdationKey].predefined_questions, already_selected_question:[ ...pre.test_types[formUpdationKey].predefined_questions.already_selected_question, value.id ]}}}}));
      }

  }


  const handleClear = () =>
  {
    setSelectedTechAndType({technology:[], questionType:[]});
    setTableRows([]);
    setMasterData((pre)=>({...pre, test_types:{...pre.test_types, [formUpdationKey]: {...pre.test_types[formUpdationKey], predefined_questions:{...pre.test_types[formUpdationKey].predefined_questions, already_selected_question:[] }}}}));
    
  }

  useEffect(()=>
  {

    if(tableRows.length==0)
    {
      axios.get("http://localhost:8080/technologyQuestions")
      .then(({data})=>
        {
          let randomIndex = Math.floor(Math.random()*((data.length-1)));
          let name = data[randomIndex].technology
          let res = data[randomIndex].data.slice(0,Number(masterData.test_types[formUpdationKey].predefined_questions.no_of_predefined_questions));
          let allIds = [];
          let i=0;
          setTableRows(res.map((element)=>{
            allIds = [...allIds, i]
            return {
              id: ++i,
              questionTitle:element.question,
              questionLevel:1,
              technology:name,
              questionType:'Mcq'
            }
          }));
          
          setMasterData((pre)=>({...pre, test_types:{...pre.test_types, [formUpdationKey]: {...pre.test_types[formUpdationKey], predefined_questions:{...pre.test_types[formUpdationKey].predefined_questions, already_selected_question:allIds }}}}))
            
        })
    }


  },[])


  return (
    <div className='relative h-[81vh]'>
      
      {/* Field 3 */}
      <div className='mb-[15px] p-2'>
        <TextField id="outlined-basic" label="Total Predefined Questions" variant="outlined" name='predefined_questions.no_of_predefined_questions' type='number' value={masterData.test_types[formUpdationKey].predefined_questions.no_of_predefined_questions} onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData})} />
        {
            !validation.no_of_predefined_questions.isValid && 
            <div className='flex flex-row items-center gap-[2px] my-1'>
                <InfoIcon color='error' style={{fontSize:'1.4rem'}}/>
                <span className='text-red-500'>{validation.no_of_predefined_questions.errMsg}</span>
            </div>
        }
      </div>
        {
          Number(masterData.test_types[formUpdationKey].predefined_questions.no_of_predefined_questions)!=0 &&
          (validation.no_of_predefined_questions.isValid) &&
      <>
        {/* //Field 2 - tech multi, type multi, search, clear, add */}
        <div className='flex items-center justify-between relative z-[10]'>
          <div className='mb-[15px] p-2 w-[32%]'>
            <Label labelName={"Select Technology"}/>
            <CreatableSelect isMulti options={technologies} value={selectedTechAndType.technology} onChange={(value)=>setSelectedTechAndType((prev)=>({...prev, technology:value}))}/>
          </div>
        
        
          <div className='mb-[15px] p-2 w-[32%] relative z-[10]'>
            <Label labelName={"Select Question Type"}/>
            <CreatableSelect isMulti options={[{label:'Mcq', value:'Mcq'},{label:'Programming', value:'Programming'},{label:'Descriptive', value:'Descriptive'}]} value={selectedTechAndType.questionType} onChange={(value)=>setSelectedTechAndType((prev)=>({...prev, questionType:value}))} />
          </div>

          <div className='flex items-center justify-between mt-[24px]'>
            <div className='mb-[15px] p-2'>
              <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
                Search
              </Button>
            </div>

            <div className='mb-[15px] p-2'>
              <Button variant="contained" color='error' startIcon={<HighlightOffIcon />} onClick={handleClear}>
                Clear
              </Button>
            </div>
            
            <div className='mb-[15px] p-2 w-[230px]'>
              <Button variant="contained" color='success' startIcon={<AddCircleOutlineIcon />} onClick={()=>{setShowAddNewQuestionForm((pre)=>!pre)}}>
                Add New Question
              </Button>
            </div>
          </div>
        </div>

        {/* //Table  */}
        <div className='h-[400px]'>
          <DataGrid
            apiRef={handleAutoChecked}
            rows={tableRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            onCellClick={handleCellClick}
            onRowSelectionModelChange={handleCellClick}
            disableRowSelectionOnClick
          />
        </div>
        
        {/* //Add New Question Form */}
        {
          showAddNewQuestionForm &&
        <AddNewQuestion handleSearch={handleSearch}/>
        }
      </>
        }


        
    </div>
    
  )
}

export default memo(PredefinedQuestion)