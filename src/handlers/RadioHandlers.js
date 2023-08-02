export const handleRadioChange = (fieldName, e, {masterData, setMasterData, formUpdationKey}) => {

    console.log(fieldName,e.target.value)

    if(fieldName==='is_mcq')
    {
        if(e.target.value === "true")
        {
            let allFieldsVals = masterData.test_types[formUpdationKey].random_questions.technologies;
            allFieldsVals.map(item=>
                {
                    item.question_type_details.programming=0;
                    item.question_type_details.descriptive=0;
                })

            setMasterData((prev)=>({...prev, test_types:{...prev.test_types, [formUpdationKey]:{...prev.test_types[formUpdationKey], random_questions:{...prev.test_types[formUpdationKey].random_questions, technologies:allFieldsVals}}}}));
        }
        else{
            let allFieldsVals = masterData.test_types[formUpdationKey].random_questions.technologies;
            allFieldsVals.map(item=>
                {
                    item.question_type_details.mcq=0;
                })

            setMasterData((prev)=>({...prev, test_types:{...prev.test_types, [formUpdationKey]:{...prev.test_types[formUpdationKey], random_questions:{...prev.test_types[formUpdationKey].random_questions, technologies:allFieldsVals}}}}));
        }
    }

    setMasterData((prev) => ({
    ...prev,
    test_types: {
        ...prev.test_types,
        [formUpdationKey]: {
        ...prev.test_types[formUpdationKey],
        [fieldName]: e.target.value,
        },
    },
    }));
};
