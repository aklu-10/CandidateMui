import TechnologyDropdown from './TechnologyDropdown'
import Label from './Label'
import InfoIcon from '@mui/icons-material/Info';
import React, { memo, useContext } from 'react'
import { TextField } from '@mui/material'
import { MasterDataContext } from './CandidateTestCreation'
import { ValidationContext } from './CandidateTestForm'
import { handleInputChange } from '../handlers/InputHandlers'


const RandomQuestion = () => {

    const {masterData, setMasterData} = useContext(MasterDataContext);
    const {formUpdationKey, validation, setValidation} = useContext(ValidationContext);

    return (
        <>
        
            <div className='mb-[15px] p-2 flex flex-col'>
                <Label labelName={"Total Random Questions"} />
                <TextField id="outlined-basic" min={0} placeholder="Total Random Questions" name='random_questions.no_of_random_question' variant="outlined" size='small' type='number' value={masterData.test_types[formUpdationKey].random_questions.no_of_random_question} onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData})}/>
                {
                    !validation.no_of_random_question.isValid && 
                    <div className='flex flex-row items-center gap-[2px] my-1'>
                        <InfoIcon color='error' style={{fontSize:'1.4rem'}}/>
                        <span className='text-red-500'>{validation.no_of_random_question.errMsg}</span>
                    </div>
                }
            </div>
            {

                (masterData.test_types[formUpdationKey].random_questions.no_of_random_question > 0) &&
                <div className='p-2'>
                {
                    validation.no_of_random_question.isValid &&
                    <TechnologyDropdown/>
                }
                </div>

            }
        </>
    )
}

export default memo(RandomQuestion)