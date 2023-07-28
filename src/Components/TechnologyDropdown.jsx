import ParticularTechnology from './ParticularTechnology';
import React, {useState} from 'react'

const TechnologyDropdown = () => {

    let technologies = [
        { label: "Python", value: "Python" },
        { label: "Java", value: "Java" },
        { label: "React", value: "React" },
        { label: "JavaScript", value: "JavaScript" }
    ];
    
    const [loader, setLoader] = useState(false);

    const [allTech, setAllTech] = useState({
        technology1: { technologies: [...technologies], selected: technologies[0] }
    });

    const addNewTech = () => {
        if (Object.keys(allTech).length >= technologies.length) return;
    
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
    };
    
    return (
        
        <>
            {
                Object.keys(allTech).map((tech) => (
                    <ParticularTechnology
                        key={tech}
                        fieldOptions={allTech[tech].technologies}
                        addNewTech={addNewTech}
                        setAllTech={setAllTech}
                        allTech={allTech}
                        techName={tech}
                        initial={technologies}
                        loader={loader}
                        setLoader={setLoader}
                    />
                ))
            }

            <button onClick={addNewTech}>Add</button>


        </>

    )
}

export default TechnologyDropdown