
export const handleInputChange = (e, {validation, setValidation, setMasterData, formUpdationKey, masterData, index, setShowAddTechnologyButton}) =>
{
    if(e.target.name.split('.').length==1)
    {
        let pattern = new RegExp(validation[e.target.name].regex)
    
        if(pattern.test(e.target.value))
            setValidation((prev)=>({...prev, [e.target.name]: {...prev[e.target.name], isValid:true }}))
        else
            setValidation((prev)=>({...prev, [e.target.name]: {...prev[e.target.name], isValid:false }}))
    
    
        setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [e.target.name]: e.target.value}}}));

    }
    else
    {
        let keys=e.target.name.split(".");

        if(keys.length==2)
        {
            let pattern = new RegExp(validation[keys[1]].regex)
            
            if((pattern.test(e.target.value) && Number(e.target.value) <= Number(masterData.test_types[formUpdationKey].total_no_question)))
                setValidation((prev)=>({...prev, [keys[1]]: {...prev[keys[1]], isValid:true }}))
            else
                setValidation((prev)=>({...prev, [keys[1]]: {...prev[keys[1]], isValid:false }}))

                
            if(keys.includes("no_of_random_question"))
            {
                setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [keys[0]]:{...prev.test_types[formUpdationKey][keys[0]], [keys[1]]:e.target.value}, predefined_questions: { ...prev.test_types[formUpdationKey].predefined_questions, no_of_predefined_questions: Number(masterData.test_types[formUpdationKey].total_no_question) - Number(e.target.value) }}}}));
                return;
            }
            else if(keys.includes("no_of_predefined_questions"))
            {
                if(Number(e.target.value)){
                    setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [keys[0]]:{...prev.test_types[formUpdationKey][keys[0]], [keys[1]]:e.target.value}, random_questions: { ...prev.test_types[formUpdationKey].random_questions, no_of_random_question: Number(masterData.test_types[formUpdationKey].total_no_question) - Number(e.target.value) }}}}));
                }
            }

            setMasterData(prev=>({...prev, test_types:{...prev.test_types,  [formUpdationKey]:{...prev.test_types[formUpdationKey], [keys[0]]:{...prev.test_types[formUpdationKey][keys[0]], [keys[1]]:e.target.value}}}}));

        }
        else if(keys.length === 3)
        {

            if((keys.indexOf("random_questions") !=-1) &&  (keys.indexOf("technologies") !=-1))
            {
                let sumOfAllQuestionDetails;

                if(masterData.test_types[formUpdationKey].is_for_agent_panel)
                {
                    sumOfAllQuestionDetails = masterData.test_types[formUpdationKey].random_questions.technologies.reduce((acc,item, iterationIndex)=>
                    {
                        if(index === iterationIndex)
                            return acc + Number(e.target.value);

                        return acc + Number(item.question_type_details.mcq);

                    },0)   
                }
                else
                {
                    if(masterData.test_types[formUpdationKey].is_mcq === "true")
                    {
                        if(keys.includes('mcq'))
                        {
                            sumOfAllQuestionDetails = masterData.test_types[formUpdationKey].random_questions.technologies.reduce((acc,item, iterationIndex)=>
                            {
                                if(index === iterationIndex)
                                    return acc + Number(e.target.value) 
        
                                return acc + Number(item.question_type_details.mcq)
        
                            },0)
                        }

                    }
                    else{

                        if(keys.includes("programming"))
                        {
                            sumOfAllQuestionDetails = masterData.test_types[formUpdationKey].random_questions.technologies.reduce((acc,item, iterationIndex)=>
                            {
                                if(index === iterationIndex)
                                    return acc + Number(e.target.value) + Number(item.question_type_details.descriptive)
        
                                return acc + Number(item.question_type_details.programming) + Number(item.question_type_details.descriptive)
        
                            },0)
                        }
                        else if(keys.includes("descriptive"))
                        {
                            sumOfAllQuestionDetails = masterData.test_types[formUpdationKey].random_questions.technologies.reduce((acc,item, iterationIndex)=>
                            {
                                if(index === iterationIndex)
                                    return acc + Number(e.target.value) + Number(item.question_type_details.programming)
        
                                return acc + Number(item.question_type_details.programming) + Number(item.question_type_details.descriptive)
        
                            },0)
                        }
                    }
                }


                if((Number(e.target.value) <= 0 )) 
                {
                    setValidation((prev)=>({...prev, technologies: { ...prev.technologies, isValid: false}}))
                }
                else if(sumOfAllQuestionDetails >= Number(masterData.test_types[formUpdationKey].random_questions.no_of_random_question))
                {
                    if(sumOfAllQuestionDetails > Number(masterData.test_types[formUpdationKey].random_questions.no_of_random_question))
                        setValidation((prev)=>({...prev, technologies: { ...prev.technologies, isValid: false}}))
                    else if(sumOfAllQuestionDetails === Number(masterData.test_types[formUpdationKey].random_questions.no_of_random_question))
                        setValidation((prev)=>({...prev, technologies: { ...prev.technologies, isValid: true}}))
                    setShowAddTechnologyButton(false)
                }
                else
                {
                    setShowAddTechnologyButton(true)
                    setValidation((prev)=>({...prev, technologies: { ...prev.technologies, isValid: true}}))
                }
                

                let copyTechnologies = masterData.test_types[formUpdationKey].random_questions.technologies;
                copyTechnologies[index].question_type_details[keys.slice(-1)[0]] = Number(e.target.value);

                setMasterData((prev)=>({...prev, test_types:{ ...prev.test_types, [formUpdationKey]: { ...prev.test_types[formUpdationKey], random_questions:{ ...prev.test_types[formUpdationKey].random_questions, technologies: copyTechnologies }}}}))
                return;
            }

            // setMasterData((prev)=>({...prev, test_types:{ ...prev.test_types, [formUpdationKey]: { ...prev.test_types[formUpdationKey], random_questions:{ ...prev.test_types[formUpdationKey].random_questions, technologies: copyTechnologies }}}}))

        }
        else
        {
            
        }


    }


}