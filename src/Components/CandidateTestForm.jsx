import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import React, { createContext, memo, useContext, useState, useRef } from 'react'
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import TabSwitch from './TabSwitch';
import RandomQuestion from './RandomQuestion';
import PredefinedQuestion from './PredefinedQuestion';
import InfoIcon from '@mui/icons-material/Info';
import Label from './Label';
import { MasterDataContext } from './CandidateTestCreation';
import { handleInputChange } from '../handlers/InputHandlers';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Delete } from '@mui/icons-material';

export const ValidationContext = createContext({});

const CandidateTestForm = ({formUpdationKey}) => {

    console.log("%cCandidate Test Form","color:red;")

    const {masterData, setMasterData, handleAddNewTestForm, handleDeleteTestForm} = useContext(MasterDataContext)

    
    let technologies = [
        { label: "Python", value: "Python" },
        { label: "Java", value: "Java" },
        { label: "React", value: "React" },
        { label: "JavaScript", value: "JavaScript" }
    ];

    const [allTech, setAllTech] = useState({
        technology1: { technologies: [...technologies], selected: technologies[0] }
    });

    const [tableRows, setTableRows] = useState([]);

    const [showAddNewQuestionForm, setShowAddNewQuestionForm] = useState(false);
    
    const [showAddTechnologyButton, setShowAddTechnologyButton] = useState(true);

    const fetchRows = useRef(true);


    let testTypeOptions = [
        {label:"Programming", value:"Programming"},
        {label:"Cognitive", value:"Cognitive"},
        {label:"Role Specific", value:"Role Specific"}
    ]

    const [validation, setValidation] = useState({
        test_name:
        {
            regex: '[^0-9][^!@#$%]+', 
            errMsg: 'Test name must not contain special character and not start with number',
            isValid: true
        },
        total_no_question:
        {
            regex:'^[1-9]\d*',
            errMsg:'Total must be greater than zero',
            isValid: true
        },
        no_of_random_question:
        {
            regex:'^[0-9]\d*',
            errMsg:'Total random questions must be greater than zero and less than total',
            isValid: true
        },
        no_of_predefined_questions:
        {
            regex:'^[0-9]\d*',
            errMsg:'Total predefined questions must be greater than zero and less than total',
            isValid: true
        },
        technologies:
        {
            regex:'^[0-9]\d*',
            errMsg:'Please provide a value which is less than total random questions (zero excluded) ',
            isValid: true
        }
    })

    const handleRadioChange = (fieldName, e) =>
    {
        setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [fieldName]: e.target.value}}}));
    }
   

    const handleCreatableSelectChange = (fieldName, selectedValue) =>
    {
        setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [fieldName]: selectedValue.value}}}));
    }

    const handleSelectChange = (fieldName, selectedValue) =>
    {


        if(fieldName==="is_for_agent_panel")
        {
            if(selectedValue.label === "Agent")
                setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [fieldName]: selectedValue.value, is_mcq: true}}}));
            else
                setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [fieldName]: selectedValue.value, is_mcq: false}}}));

            return;
        }

        setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [fieldName]: selectedValue.value}}}));
    }


    return (
        
        <ValidationContext.Provider value={{validation, setValidation, formUpdationKey, allTech, setAllTech, tableRows, setTableRows, showAddNewQuestionForm, setShowAddNewQuestionForm, fetchRows, showAddTechnologyButton, setShowAddTechnologyButton}}>
            
            {/* Test Name */}
            <div className='mb-[15px] p-2 flex flex-row items-center relative'>
                <div className='flex flex-col rounded w-[80%]'>
                    <Label labelName={"Test Name"}/>
                    <TextField id="outlined-basic" value={masterData.test_types[formUpdationKey].test_name} variant="outlined" size='small' name='test_name' onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData})}/>
                    {
                        !validation.test_name.isValid && 
                        <div className='flex flex-row items-center gap-[2px] my-1'>
                            <InfoIcon color='error' style={{fontSize:'1.4rem'}}/>
                            <span className='text-red-500'>{validation.test_name.errMsg}</span>
                        </div>
                    }
                </div>

                <div className='absolute top-[34px] right-[185px]'>
                    {
                        formUpdationKey === "form1" 
                        
                        ?

                        <Button variant="contained" onClick={handleAddNewTestForm}>
                            <AddCircleOutlineIcon className='text-white-700'/>
                        </Button>
                        
                        :
                        
                        <Button variant="contained" onClick={()=>handleDeleteTestForm(formUpdationKey)}>
                            <Delete className='text-white-700'/>
                        </Button>
                        

                    }
                    </div>
            </div>

            {/* Test Type */}
            <div className='mb-[15px] p-2 w-[80%]'>
                <Label labelName={"Select Test Type, or add new test type"}/>
                <CreatableSelect isClearable options={testTypeOptions} defaultValue={masterData.test_types[formUpdationKey].test_type_key} onChange={(value)=>handleCreatableSelectChange("test_type_key", value)}/>
            </div>

            {/* Managed By */}
            <div className='mb-[15px] p-2 flex flex-row'>
             
                <div className='w-[80%]'>
                    <Label labelName={"Managed By"}/>
                    <Select
                        defaultValue={{label:`${masterData.test_types[formUpdationKey].is_for_agent_panel ? "Agent" : "Candidate"}`, value:masterData.test_types[formUpdationKey].is_for_agent_panel}}
                        options={[{label:'Agent', value:true}, {label:'Candidate', value:false}]}
                        onChange={(value)=>handleSelectChange("is_for_agent_panel", value)}
                    />
                </div>

                <div className='pl-[10px]'>
                    <Label labelName={"Is Mcq"}/>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={String(masterData.test_types[formUpdationKey].is_mcq)}
                        onChange={(e)=>handleRadioChange("is_mcq" ,e)}
                    >
                        {
                            masterData.test_types[formUpdationKey].is_for_agent_panel ?
                            <>
                                <FormControlLabel value="true" checked disabled control={<Radio name='isMcq'/>} label="Yes" />
                                <FormControlLabel value="false"  checked={false} control={<Radio name='isMcq'/>} disabled label="No" />
                            </>
                            :  <>
                                <FormControlLabel value="true" control={<Radio name='isMcq'/>} label="Yes" />
                                <FormControlLabel value="false" control={<Radio name='isMcq'/>} label="No" />
                            </>
                        }
                    </RadioGroup>
                </div>

            </div>

            {/* Screening Type */}
            <div className='mb-[15px] p-2 w-[80%]'>
                <Label labelName={"Screening Type"}/>
                <Select
                    defaultValue={{label:`${masterData.test_types[formUpdationKey].is_screening_test===0 ? 'Pre Interview' : 'Post Interview'}`, value:masterData.test_types[formUpdationKey].is_screening_test}}
                    options={[{label:'Pre Interview', value:0},{label:'Post Interview', value:1}]}
                    onChange={(value)=>handleSelectChange("is_screening_test", value)}
                />
            </div>

            {/* Total Questions */}
            <div className='mb-[15px] p-2 flex flex-col w-[80%]'>
                <Label labelName={"Total Number Of Questions"}/>
                <TextField id="outlined-basic" type='number'placeholder='Total Number of Questions' size='small' variant="outlined" name='total_no_question' value={masterData.test_types[formUpdationKey].total_no_question} onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData})}/>
                {
                    !validation.total_no_question.isValid && 
                    <div className='flex flex-row items-center gap-[2px] my-1'>
                        <InfoIcon color='error' style={{fontSize:'1.4rem'}}/>
                        <span className='text-red-500'>{validation.total_no_question.errMsg}</span>
                    </div>
                }
            </div>

            {/* Tab Switch */}
            {
                masterData.test_types[formUpdationKey].test_name &&
                validation.test_name.isValid &&
                masterData.test_types[formUpdationKey].test_type_key &&
                String(masterData.test_types[formUpdationKey].is_screening_test) &&
                masterData.test_types[formUpdationKey].total_no_question > 0 &&

                <TabSwitch tabs={[{label:'Random Questions', value: <RandomQuestion/>}, {label:'Predefined Questions', value:<PredefinedQuestion/>}]} />


            }

        </ValidationContext.Provider>
    )
}

export default memo(CandidateTestForm)