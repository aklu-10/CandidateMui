import React, { memo, useState } from 'react'

const TabSwitch = ({tabs}) => {

    const [toggleTab, setToggleTab] = useState(tabs[0]);

    const switchTab = (index) =>
    {
        setToggleTab(tabs[index]);
    }

    return (
        
        <div className='mb-[15px] p-2'>
            {
                tabs.map((tab,index)=>(
                    <button key={(tab.label)+index} className='mb-[15px] w-[50%] p-2' onClick={()=>switchTab(index)}>{tab.label}</button>
                ))
            }

            {
                <toggleTab.value/>  
            }

        </div>


    )
}

export default memo(TabSwitch)