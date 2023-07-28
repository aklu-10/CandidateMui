import React, { memo } from 'react'

const Label = ({labelName}) => {

    return (
        <label>{labelName}</label>
        )
}

export default memo(Label)