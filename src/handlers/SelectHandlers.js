export const handleCreatableSelectChange = (fieldName, selectedValue, {setMasterData, formUpdationKey}) => {
    setMasterData((prev) => ({
    ...prev,
    test_types: {
        ...prev.test_types,
        [formUpdationKey]: {
        ...prev.test_types[formUpdationKey],
        [fieldName]: selectedValue.value,
        },
    },
    }));
};

export const handleSelectChange = (fieldName, selectedValue, {setMasterData, formUpdationKey}) => {
    if (fieldName === "is_for_agent_panel") {
    if (selectedValue.label === "Agent")
        setMasterData((prev) => ({
        ...prev,
        test_types: {
            ...prev.test_types,
            [formUpdationKey]: {
            ...prev.test_types[formUpdationKey],
            [fieldName]: selectedValue.value,
            is_mcq: true,
            },
        },
        }));
    else
        setMasterData((prev) => ({
        ...prev,
        test_types: {
            ...prev.test_types,
            [formUpdationKey]: {
            ...prev.test_types[formUpdationKey],
            [fieldName]: selectedValue.value,
            is_mcq: false,
            },
        },
        }));

    return;
    }

    setMasterData((prev) => ({
    ...prev,
    test_types: {
        ...prev.test_types,
        [formUpdationKey]: {
        ...prev.test_types[formUpdationKey],
        [fieldName]: selectedValue.value,
        },
    },
    }));
};