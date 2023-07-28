import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import React, { memo } from 'react'
import { TextField } from '@mui/material'
import TabSwitch from './TabSwitch';
import RandomQuestion from './RandomQuestion';
import PredefinedQuestion from './PredefinedQuestion';
import Label from './Label';

const CandidateTestForm = () => {

    let testTypeOptions = [
        {label:"Programming", value:"Programming"},
        {label:"Cognitive", value:"Cognitive"},
        {label:"Role Specific", value:"Role Specific"}
    ]


    return (
        
        <>
            
            {/* Test Name */}
            <div className='mb-[15px] p-2'>
                <TextField id="outlined-basic" label="Test Name" variant="standard" />
            </div>

            {/* Test Type */}
            <div className='mb-[15px] p-2'>
                <Label labelName={"Select Test Type, or add new test type"}/>
                <CreatableSelect isClearable options={testTypeOptions} />
            </div>

            {/* Managed By */}
            <div className='mb-[15px] p-2'>
                <Label labelName={"Managed By"}/>
                <Select
                    options={[{label:'Agent', value:true, label:'Candidate', value:false}]}
                />
            </div>

            {/* Screening Type */}
            <div className='mb-[15px] p-2'>
                <Label labelName={"Screening Type"}/>
                <Select
                    options={[{label:'Pre Interview', value:0, label:'Post Interview', value:1}]}
                />
            </div>

            {/* Total Questions */}
            <div className='mb-[15px] p-2'>
                <TextField id="outlined-basic" label="Test Name" variant="standard" />
            </div>

            {/* Tab Switch */}
            <TabSwitch tabs={[{label:'Random Questions', value:RandomQuestion}, {label:'Predefined Questions', value:PredefinedQuestion}]} />

        </>

    )
}

export default memo(CandidateTestForm)