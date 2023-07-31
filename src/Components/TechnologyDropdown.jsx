import ParticularTechnology from './ParticularTechnology';
import React, {memo, useState} from 'react'
import { useContext } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { MasterDataContext } from './CandidateTestCreation';
import { ValidationContext } from './CandidateTestForm';
import { Button } from '@mui/material';

const TechnologyDropdown = () => {

    
    const [loader, setLoader] = useState(false);

    let technologies = [
        { label: "Python", value: "Python" },
        { label: "Java", value: "Java" },
        { label: "React", value: "React" },
        { label: "JavaScript", value: "JavaScript" }
    ];

    const {masterData, setMasterData} = useContext(MasterDataContext);
    const {formUpdationKey, validation, setValidation, allTech, setAllTech, showAddTechnologyButton, setShowAddTechnologyButton} = useContext(ValidationContext);


    const addNewTech = () => {
        
        if (Object.keys(allTech).length >= technologies.length) return;
        
        if(masterData.test_types[formUpdationKey].is_for_agent_panel)
        {
            let lastTech = masterData.test_types[formUpdationKey].random_questions.technologies.slice(-1)[0];
            if((lastTech.question_type_details.mcq <= 0))
            {
                setValidation((prev)=>({...prev, technologies: { ...prev.technologies, isValid: false}}))
                return;
            }
            else
                setValidation((prev)=>({...prev, technologies: { ...prev.technologies, isValid: true}}))
        }


        let base = {
        technologies: [],
        selected: {}
        };
    
        let prevTechnologies =
        allTech[Object.keys(allTech).slice(-1)[0]].technologies;
    
        let prevSelected = allTech[Object.keys(allTech).slice(-1)[0]].selected;
    
        base.technologies = prevTechnologies.filter(
        (technology) => technology.value != prevSelected.value
        );
    
        base.selected = base.technologies[0];
    
        let nextTechKeyName =
        "technology" + (Number(Object.keys(allTech).slice(-1)[0].slice(-1)) + 1);

        setAllTech((prev) => ({ ...prev, [nextTechKeyName]: { ...base } }));

        setMasterData((prev)=>({...prev, test_types: { ...prev.test_types, [formUpdationKey]: { ...prev.test_types[formUpdationKey], random_questions:{ ...prev.test_types[formUpdationKey].random_questions, technologies: [...prev.test_types[formUpdationKey].random_questions.technologies, { technology_key:'', question_type_details: { mcq:0, programming:0, descriptive:0 } }]}}}}))

    };
    
    const deleteSpecificTech = (techKey, techIndex) => 
    {
        let copyAllTech = {...allTech};

        delete copyAllTech[techKey];

        setAllTech(copyAllTech)

        let sumOfAllQuestionDetails = masterData.test_types[formUpdationKey].random_questions.technologies.reduce((acc,item, iterationIndex)=>
        {
            if(iterationIndex === techIndex) return acc;
            return acc + Number(item.question_type_details.mcq) + Number(item.question_type_details.programming) + Number(item.question_type_details.descriptive)
        },0)

        if(sumOfAllQuestionDetails < Number(masterData.test_types[formUpdationKey].random_questions.no_of_random_question))
            setShowAddTechnologyButton(true)

    
        let techArr = [...masterData.test_types[formUpdationKey].random_questions.technologies];
        techArr.splice(techIndex,1);
        
        setMasterData((prev)=>({...prev, test_types:{ ...prev.test_types, [formUpdationKey]: { ...prev.test_types[formUpdationKey], random_questions:{ ...prev.test_types[formUpdationKey].random_questions, technologies: techArr }}}}))
 
    }

    return (
        
        <div className='flex items-start gap-5 relative' >
            
            <div className='flex flex-col'>
            {
                Object.keys(allTech).map((tech, index) => (
                    <ParticularTechnology
                        key={tech}
                        index={index}
                        fieldOptions={allTech[tech].technologies}
                        addNewTech={addNewTech}
                        deleteSpecificTech={deleteSpecificTech}
                        setAllTech={setAllTech}
                        allTech={allTech}
                        techName={tech}
                        initial={technologies}
                        loader={loader}
                        setLoader={setLoader}
                        setShowAddTechnologyButton={setShowAddTechnologyButton}
                    />
                ))
            }
            {
                !validation.technologies.isValid &&
                <div className='flex flex-row items-center gap-[2px] my-1'>
                    <InfoIcon color='error' style={{fontSize:'1.4rem'}}/>
                    <span className='text-red-500'>{validation.technologies.errMsg}</span>
                </div>
            }
            </div>
            
            <div className='absolute top-0 left-80'>
                {
                    showAddTechnologyButton &&
                    <Button variant="contained" color='primary' onClick={addNewTech} >
                        Add Technology
                    </Button>
                }
            </div>

        </div>

    )
}

export default memo(TechnologyDropdown)