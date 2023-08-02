import React, { memo, useState } from 'react'

const TabSwitch = ({tabs}) => {

    const [toggleTab, setToggleTab] = useState(tabs[0]);


    const switchTab = (switchedTab) =>
    {
        setToggleTab(switchedTab);
    }

    return (
        
        <div className='mb-[15px] p-2'>
            {
                tabs.map((tab,index)=>(
                    <button key={(tab.label)+index} className={`mb-[15px] w-[50%] border-b-[1px] p-2 ${tab.label === toggleTab.label ? 'border shadow' : 'text-gray-300' }`} onClick={()=>switchTab(tab)}>{tab.label}</button>
                ))
            }

            {
                toggleTab.value
            }

        </div>


    )
}

export default memo(TabSwitch)