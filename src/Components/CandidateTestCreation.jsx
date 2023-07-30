import CandidateTestForm from './CandidateTestForm';
import React, { useState, useRef, memo, createContext, useEffect } from 'react'
import { baseCandidateFormData } from '../data/baseCandidateFormData';
import { Button } from '@mui/material';

export const MasterDataContext = createContext({})

const CandidateTestCreation = () => {

    console.log("%cCandidate Test Creation","color:red;")

    //for key
    let formUid = useRef(1);

    //masterData
    const [masterData, setMasterData] = useState({
        hiring_request_id: 57,
        level: 2,
        hiring_technologies: ['python-key', 'java-spring'],
        test_types: { 
            ['form'+formUid.current]: {...baseCandidateFormData}
        }
    });

    const handleCandidateFormSubmission = (e) =>
    {
        let result = {...masterData, test_types: Object.values(masterData.test_types)};
        console.log(result)
    }

    const [isValidSubmission, setIsValidSubmission] = useState(false);

    useEffect(()=>
    {
        Object.keys(masterData.test_types).map(form=>{
            let {test_name, test_type_key, total_no_question, predefined_questions:{no_of_predefined_questions}, random_questions:{no_of_random_question}} = masterData.test_types[form];

            if(test_name && test_type_key && (Number(total_no_question) > 0 ) && (Number(no_of_predefined_questions) > 0 ) && (Number(no_of_random_question) > 0 ) && ( (Number(no_of_predefined_questions) + Number(no_of_random_question)) <= Number(total_no_question) ) )
            {
                let sumOfAllQuestionDetails;

                if(masterData.test_types[form].is_for_agent_panel === "true")
                {
                    sumOfAllQuestionDetails = masterData.test_types[form].random_questions.technologies.reduce((acc,item)=>
                    {
                        return acc + Number(item.question_type_details.mcq);
    
                    },0) 
                }
                else
                {
                    if(masterData.test_types[form].is_mcq)
                    {
                        sumOfAllQuestionDetails = masterData.test_types[form].random_questions.technologies.reduce((acc,item)=>
                        {
                            return acc + Number(item.question_type_details.mcq);
        
                        },0)
                    }
                    else
                    {
                        sumOfAllQuestionDetails = masterData.test_types[form].random_questions.technologies.reduce((acc,item)=>
                        {
                            return acc + Number(item.question_type_details.programming) + Number(item.question_type_details.descriptive);
        
                        },0)
                    }
                }
                
                if(sumOfAllQuestionDetails < Number(no_of_random_question)){
                    setIsValidSubmission(false)
                    return;
                }

                if(masterData.test_types[form].predefined_questions.already_selected_question.length !== Number(no_of_predefined_questions))
                {
                    setIsValidSubmission(false)
                    return;
                }
                
                setIsValidSubmission(true);

            }
            else
                setIsValidSubmission(false);
        })

    },[masterData])

    return (
        <MasterDataContext.Provider value={{masterData, setMasterData}}>
            <div>
            {
                Object.keys(masterData.test_types).map(()=>
                (
                    <CandidateTestForm key={('form'+formUid.current)} formUpdationKey={('form'+formUid.current)}/>
                ))
            }
            
                <div className='p-2 flex gap-5'>
                    <Button variant="contained" color='primary' disabled={!isValidSubmission} onClick={handleCandidateFormSubmission}>
                        Submit Candidate Test
                    </Button>
                    <Button variant="contained" color='primary' disabled>
                        Final Submit
                    </Button>
                </div>

            </div>
        </MasterDataContext.Provider>
    )
}

export default memo(CandidateTestCreation);