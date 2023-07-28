import React from "react";

const ParticularTechnology = ({fieldOptions, techName, setAllTech, allTech, initial, loader, setLoader,}) =>{

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
        
            setLoader(true);
        
            setTimeout(() => setLoader(false), 10);
    }
    

    return (
        <div className="mb-[40px]">
            {loader ? (
                <p>Loading...</p>
            ) : (
                <select
                className="w-[300px] p-2"
                onChange={handleChange}
                defaultValue={allTech[techName].selected.value}
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
        </div>
        )

};

export default ParticularTechnology;
