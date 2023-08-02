import Select from 'react-select';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import SaveIcon from '@mui/icons-material/Save';
import Label from './Label';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import React, { useState } from 'react'
import { Button ,IconButton, TextField } from '@mui/material'
import { useContext } from 'react';
import { ValidationContext } from './CandidateTestForm';
import { MasterDataContext } from './CandidateTestCreation';

let technologies = [
    { label: "Python", value: "Python" },
    { label: "Java", value: "java" },
    { label: "React", value: "react" },
    { label: "Php", value: "php" }
  ];

const AddNewQuestion = () => {

  const {setShowAddNewQuestionForm, setTableRows, formUpdationKey, tableRows, setSelectedRows, selectedRows} = useContext(ValidationContext);
  const {masterData, setMasterData} = useContext(MasterDataContext);

    const [addNewQuestionState, setAddNewQuestionState] = useState({
        technology:'',
        questionType:'',
        questionTitle:'',
        options:{ option1:''},
        correctAnswer:''
    });

    const handleAddNewOption = () =>
    {
        if(Object.keys(addNewQuestionState.options).length > 3) return;
        
        let lastOption = 'option' + (Number(Object.keys(addNewQuestionState.options).slice(-1)[0].slice(-1))+1);
        setAddNewQuestionState(pre=>({...pre, options:{...pre.options, [lastOption]:''}}))

    }

const handleDeleteOption = (optionField) =>
{
    if(Object.keys(addNewQuestionState.options).length===1) return;
    let copyOptions = {...addNewQuestionState.options};
    delete copyOptions[optionField];
    setAddNewQuestionState((prev)=>({...prev, options: copyOptions}))
}

const handleSaveForm = () =>
{
  if(addNewQuestionState.questionType === 'mcq')
  {
    if(!((Object.keys(addNewQuestionState.options).length > 1) && (Object.keys(addNewQuestionState.options).filter(option=>addNewQuestionState.options[option].trim().length!=0).length === Object.keys(addNewQuestionState.options).length) && addNewQuestionState.correctAnswer) )
      return;
  }
  
  if(addNewQuestionState.technology && addNewQuestionState.questionType && addNewQuestionState.questionTitle)
  {
    let ids = { Python:1, react:2, java:3, php:4 };
    axios.get("http://localhost:5050/technologyQuestions/"+ids[addNewQuestionState.technology])
    .then(({data})=>
    {
      let obj = {...data}, questions = [...obj.data], lastIndex = questions.slice(-1)[0].id+1;
      let newQuestionToAdd = {
        id:lastIndex+1,
        questionTitle:addNewQuestionState.questionTitle,
        questionLevel:1,
        technology:addNewQuestionState.technology[0].toUpperCase()+addNewQuestionState.technology.slice(1,),
        questionType:addNewQuestionState.questionType
      }

      axios.put("http://localhost:5050/technologyQuestions/"+ids[addNewQuestionState.technology], {...obj, data: [...questions, {id:newQuestionToAdd.id, question:newQuestionToAdd.questionTitle, option:[], correctAnswer:'', questionType:newQuestionToAdd.questionType}]})
      .then((res)=>{

        setShowAddNewQuestionForm(false); 
    
        setMasterData((prev)=>({...prev, test_types:{...prev.test_types, [formUpdationKey]:{...prev.test_types[formUpdationKey], predefined_questions:{...prev.test_types[formUpdationKey].predefined_questions, newly_created_questions:[...prev.test_types[formUpdationKey].predefined_questions.newly_created_questions,  newQuestionToAdd], already_selected_question: [...prev.test_types[formUpdationKey].predefined_questions.already_selected_question, res.data.id]}}}}))

        setTableRows((prev)=>([newQuestionToAdd,...prev]))

        setSelectedRows((pre)=>[...pre, newQuestionToAdd.id])

      }).catch(console.log)
    }).catch(console.log)

  }
  else
  {
    console.log("error");
  }
}

const handleSaveAndCreateForm = () =>
{
  handleSaveForm();
  setShowAddNewQuestionForm(false);
  setTimeout(()=>
  {
    setShowAddNewQuestionForm(true)
  },10);
}

  return (
    
    <div className='absolute top-[0] right-[10px] bg-white shadow-xl rounded-md p-2 border z-[10]' >

    <div className='mb-[15px] p-2'>
          <Label labelName={"Technology"}/>
          <Select
              options={technologies}
              onChange={(value)=>setAddNewQuestionState((pre)=>({...pre, technology:value.value}))}
          />
      </div>


      <div className='mb-[15px] p-2'>
          <Label labelName={"Question Type"}/>
          <Select
              options={[{label:'Mcq', value:'mcq'}, {label:'Programming', value:'programming'}, {label:'Descriptive', value:'descriptive'}]}
              onChange={(value)=>setAddNewQuestionState((pre)=>({...pre, questionType:value.value}))}
          />
      </div>

      <div className='mb-[15px] p-2 flex flex-col'>
          <Label labelName={"Question Title"}/>
          <TextField id="outlined-basic" variant="outlined" size='small' onChange={(e)=>setAddNewQuestionState((pre)=>({...pre, questionTitle:e.target.value}))}/>
      </div>

      <div className='mb-[15px] p-2'>
        
        <div>
        {
          addNewQuestionState.questionType === 'mcq' &&
          <>
            <Button variant="contained" color='success' startIcon={<AddCircleOutlineIcon />} onClick={handleAddNewOption}>
              Add Options
            </Button>

            <div>

                {
                    Object.keys(addNewQuestionState.options).map((option, index)=>(

                        <div className='flex items-center' key={option}>
                            <div className='mb-[15px] p-2 flex flex-col '>
                            <Label labelName={"Answer Option ("+ (index +1) +")"}/>
                            <TextField id="outlined-basic"  variant="outlined" size='small' name={option} onChange={(e)=>setAddNewQuestionState((pre)=>({...pre, options:{...pre.options, [option]:e.target.value }}))}/>
                            </div>
                        
                            <div className='mb-[15px] p-2 pl-[20px] flex flex-col'>
                                <Label labelName={"Is Correct"}/>
                                <input className='text-xl' type='radio' name='correctAnswer' value={addNewQuestionState.options[option]}
                                onChange={(e)=>setAddNewQuestionState((pre)=>({...pre, correctAnswer:e.target.value }))}
                                />
                            </div>

                            <IconButton color='error' onClick={()=>handleDeleteOption(option)}>
                              <DeleteIcon />
                            </IconButton>
                        </div>

                    ))
                }  

              
            </div>
          </>
          
        }

        </div>


        <div className='flex flex-wrap justify-start'>
              <div className='mb-[15px] p-2'>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveForm}>
                  Save
                </Button>
              </div>

              <div className='mb-[15px] p-2'>
                <Button variant="contained" startIcon={<SendAndArchiveIcon />}  onClick={handleSaveAndCreateForm}>
                  Save And Create New
                </Button>
              </div>

              <div className='mb-[15px] p-2'>
                <Button variant="contained" color='error' startIcon={<HighlightOffIcon />}  onClick={()=>{setShowAddNewQuestionForm((pre)=>!pre)}}>
                  Cancel
                </Button>
              </div>

        </div>

      </div>

</div>
  )
}

export default AddNewQuestion