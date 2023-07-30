import React, { memo, useState } from 'react'

const TabSwitch = ({tabs}) => {

    const [toggleTab, setToggleTab] = useState(tabs[0].value);

    const switchTab = (value) =>
    {
        setToggleTab(value);
    }

    return (
        
        <div className='mb-[15px] p-2'>
            {
                tabs.map((tab,index)=>(
                    <button key={(tab.label)+index} className='mb-[15px] w-[50%] p-2' onClick={()=>switchTab(tab.value)}>{tab.label}</button>
                ))
            }

            {
                toggleTab
            }

        </div>


    )
}

export default memo(TabSwitch)