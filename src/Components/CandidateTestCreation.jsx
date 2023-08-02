import CandidateTestForm from './CandidateTestForm';
import React, { useState, useRef, memo, createContext, useEffect } from 'react'
import { baseCandidateFormData } from '../data/baseCandidateFormData';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const MasterDataContext = createContext({})

const CandidateTestCreation = () => {

    console.log("%cCandidate Test Creation","color:red;");

    let toastTimer = useRef({timer:null,run:true});
    //masterData
    const [masterData, setMasterData] = useState({
        hiring_request_id: 57,
        level: 2,
        hiring_technologies: ['python-key', 'java-spring'],
        test_types: { 
            form1: {...baseCandidateFormData}
        }
    });

    const handleCandidateFormSubmission = (e) =>
    {
        let result = {...masterData, test_types: Object.values(masterData.test_types)};
        
        console.log(result)

    }

    const [isValidSubmission, setIsValidSubmission] = useState(false);


    const handleAddNewTestForm = () =>
    {
        if(isValidSubmission){
            let lastFormKey = (Number(Object.keys(masterData.test_types).slice(-1)[0].slice(-1))+1);
            setMasterData(pre=>({...pre, test_types: {...pre.test_types, ['form'+lastFormKey]:{...baseCandidateFormData}}}));
        }
        else
        {
            if(toastTimer.current.run){
                toast.error("Please fill the requied fields")
                toastTimer.current.run=false;
            }
            clearTimeout(toastTimer.current.timer);
            toastTimer.current.timer = setTimeout(()=>
            {
                toastTimer.current.run = true;
            },1000)
        }
    }

    const handleDeleteTestForm = (formKey) =>
    {
        let copyMasterTests = {...masterData.test_types};
        delete copyMasterTests[formKey];
        setMasterData(pre=>({...pre, test_types:copyMasterTests}));
    }

    useEffect(()=>
    {

        let checkPredefined = false, checkRandom = false;

        Object.keys(masterData.test_types).map(form=>{

            let {test_name, test_type_key, total_no_question, predefined_questions:{no_of_predefined_questions}, random_questions:{no_of_random_question}} = masterData.test_types[form];

            if(test_name && test_type_key && (Number(total_no_question) > 0 ) && (Number(no_of_predefined_questions) >= 0 ) && (Number(no_of_random_question) >= 0 ) && ( (Number(no_of_predefined_questions) + Number(no_of_random_question)) <= Number(total_no_question) ) )
            {

                if(Number(no_of_predefined_questions) === Number(total_no_question))
                    checkRandom=false;
                else
                    checkRandom=true;
            

                if(Number(no_of_random_question) === Number(total_no_question))
                    checkPredefined=false;
                else
                    checkPredefined=true;
                
                if(checkRandom)
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
                        if(masterData.test_types[form].is_mcq === "true" || masterData.test_types[form].is_mcq)
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

                    if(sumOfAllQuestionDetails !== Number(no_of_random_question)){
                        setIsValidSubmission(false)
                        return;
                    }

                    if(sumOfAllQuestionDetails!=0 && (Number(no_of_random_question) === Number(total_no_question)))
                        setIsValidSubmission(true)
                }

                if(checkPredefined)
                {
                    if(masterData.test_types[form].predefined_questions.already_selected_question.length !== Number(no_of_predefined_questions))
                    {
                        setIsValidSubmission(false)
                        return;
                    }
                    else{
                        setIsValidSubmission(true)
                        return;
                    }
                }


                if(!(Number(no_of_predefined_questions) === 0 || Number(no_of_random_question) === 0))
                    setIsValidSubmission(true);
            }
            else
                setIsValidSubmission(false);
        })

    },[masterData])

    return (

        <>

            <ToastContainer position='top-right'/>


        <MasterDataContext.Provider value={{masterData, setMasterData, handleAddNewTestForm, handleDeleteTestForm}}>
            <div>
            {
                Object.keys(masterData.test_types).map((form)=>
                (
                    <CandidateTestForm key={form} formUpdationKey={form}/>
                ))
            }
            
                <div className='p-2 flex gap-5'>
                    <Button variant="contained" color='primary' disabled={!isValidSubmission}  onClick={handleCandidateFormSubmission}>
                        Submit Candidate Test
                    </Button>
                    <Button variant="contained" color='primary' disabled>
                        Final Submit
                    </Button>
                </div>

            </div>
        </MasterDataContext.Provider>
    </>

    )
}

export default memo(CandidateTestCreation);