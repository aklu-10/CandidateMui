import CandidateTestForm from './CandidateTestForm';
import React, { useState, useRef, memo } from 'react'
import { baseCandidateFormData } from '../data/baseCandidateFormData';

const CandidateTestCreation = () => {

    //for key
    let formUid = useRef(1);

    //masterData
    const [masterData, setMasterData] = useState({
        hiring_request_id: 57,
        level: 2,
        hiring_technologies: ['python-key', 'java-spring'],
        test_types: [{...baseCandidateFormData}]
    });

    return (
        <>
            {
                masterData.test_types.map(()=>
                (
                    <CandidateTestForm key={('form'+formUid.current)}/>
                ))
            }

        </>
    )
}

export default memo(CandidateTestCreation);