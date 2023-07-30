import { TextField } from "@mui/material";
import { useContext, useEffect } from "react";
import { MasterDataContext } from "./CandidateTestCreation";
import { ValidationContext } from "./CandidateTestForm";
import { handleInputChange } from "../handlers/InputHandlers";
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";
import Label from "./Label";

const ParticularTechnology = ({fieldOptions, techName, setAllTech, allTech, initial, loader, setLoader, index, setShowAddTechnologyButton, deleteSpecificTech}) =>{

    const {masterData, setMasterData} = useContext(MasterDataContext);
    const {formUpdationKey, validation, setValidation} = useContext(ValidationContext);

    const handleChange = (event) => {
    
            let resultObj = {};
        
            let techKeyArr = Object.keys(allTech);
            let startIndex = techKeyArr.indexOf(techName);
            let nonOperationalKeys = techKeyArr.slice(0, startIndex);
            let operationalKeys = techKeyArr.slice(startIndex);
        
            nonOperationalKeys.map((key) => {
            resultObj = { ...resultObj, [key]: allTech[key] };
            });
        
            let nextBaseFilterArr, nextSelectedValue;
        
            if (nonOperationalKeys.length === 0) {
            nextBaseFilterArr = initial;
            nextSelectedValue = "";
            } else {
            nextBaseFilterArr = allTech[nonOperationalKeys.slice(-1)[0]].technologies;
            nextSelectedValue = allTech[nonOperationalKeys.slice(-1)[0]].selected;
            }
        
            operationalKeys.map((key) => {
            let currentBaseFilterArr = nextBaseFilterArr.filter(
                (data) => data.value !== nextSelectedValue.value
            );
            let currentSelected;
            if (techName === key) 
            {
                currentSelected = 
                {
                    label: event.target.value,
                    value: event.target.value
                }
                
            }
            else
            {
                currentSelected = currentBaseFilterArr[0];

            }
            resultObj = {
                ...resultObj,
                [key]: { technologies: currentBaseFilterArr, selected: currentSelected }
            };
        
            nextBaseFilterArr = currentBaseFilterArr;
            nextSelectedValue = currentSelected;
            });
        
            setAllTech({ ...resultObj });

            console.log(resultObj);

            let selectedArr = Object.keys(resultObj).map(technologyKey=>(
                resultObj[technologyKey].selected.value
            ))

            setMasterData((prev)=>({...prev, test_types: { ...prev.test_types, [formUpdationKey]: { ...prev.test_types[formUpdationKey], random_questions:{ ...prev.test_types[formUpdationKey].random_questions, technologies: (prev.test_types[formUpdationKey].random_questions.technologies).map((technology, index)=>({...technology, technology_key: selectedArr[index] }) )   }}}}))

            setLoader(true);
            setTimeout(() => setLoader(false), 10);
    }
    
    useEffect(()=>
    {
        let updateTechnologies = [...masterData.test_types[formUpdationKey].random_questions.technologies];
        updateTechnologies[index].technology_key = allTech[techName].selected.value;
        setMasterData((prev)=>({...prev, test_types: { ...prev.test_types, [formUpdationKey]: { ...prev.test_types[formUpdationKey], random_questions:{ ...prev.test_types[formUpdationKey].random_questions, technologies: updateTechnologies }}}}))
    },[])


    console.log(techName, allTech[techName])

    return (
        <div className={`mb-[40px] flex`}>
            <div>

                <div className="flex flex-row">

                    {loader ? (
                        <p>Loading...</p>
                    ) : (
                        <select
                        className="w-[300px] p-2 mb-[15px] border"
                        onChange={handleChange}
                        defaultValue={allTech[techName].selected?.value}
                        key={techName}
                        >
                        {loader ? (
                            <span>loading...</span>
                        ) : (
                            fieldOptions.map((technology, index) =>
                            loader ? (
                                <></>
                            ) : (
                                <option key={technology.value} value={technology.value}>
                                {technology.label}
                                </option>
                            )
                            )
                        )}
                        </select>
                    )}
                    {
                        index!=0 &&
                        <IconButton color='error' className="self-start" onClick={()=>deleteSpecificTech(techName, index)}>
                            <DeleteIcon />
                        </IconButton>
                    }
                                        
                </div>

                <div className="flex flex-row gap-5">
                    {
                        masterData.test_types[formUpdationKey].is_for_agent_panel === true ?

                        <div className="flex flex-col">
                            <Label labelName={"Number of Mcq questions"}/>
                            <TextField id="outlined-basic" size="small"
                            type="number"
                            key="mcq"
                            value={masterData.test_types[formUpdationKey].random_questions.technologies[index].question_type_details.mcq}
                            name="random_questions.technologies.mcq" onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData , index, setShowAddTechnologyButton})}/>
                        </div> : masterData.test_types[formUpdationKey].is_mcq === "true" ?

                        <div className="flex flex-col">
                        <Label labelName={"Number of Mcq questions"}/>
                        <TextField id="outlined-basic" size="small"
                        type="number"
                        key="mcq"
                        value={masterData.test_types[formUpdationKey].random_questions.technologies[index].question_type_details.mcq}
                        name="random_questions.technologies.mcq" onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData , index, setShowAddTechnologyButton})}/>
                        </div> :
                        <>
                            <div className="flex flex-col">
                                <Label labelName={"Number of Programming questions"}/>
                                <TextField id="outlined-basic" size="small"
                                type="number"
                                key="programming"
                                value={masterData.test_types[formUpdationKey].random_questions.technologies[index].question_type_details.programming}
                                name="random_questions.technologies.programming" onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData , index, setShowAddTechnologyButton})}/>
                            </div>     

                            <div className="flex flex-col">
                                <Label labelName={"Number of Descriptive questions"}/>
                                <TextField id="outlined-basic" size="small"
                                type="number"
                                key="programming"
                                value={masterData.test_types[formUpdationKey].random_questions.technologies[index].question_type_details.descriptive}
                                name="random_questions.technologies.descriptive" onChange={(e)=>handleInputChange(e,{validation,  setValidation, setMasterData, formUpdationKey, masterData , index, setShowAddTechnologyButton})}/>
                            </div>     
                        </>
                        
                    }
                </div>

            </div>

           

        </div>
        )

};

export default ParticularTechnology;
