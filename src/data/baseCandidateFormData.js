export const baseCandidateFormData = 
{
        test_type_key: '',
        test_name: '',
        is_screening_test: 0,
        is_for_agent_panel: true,
        is_mcq: true,
        no_of_predefined_questions: 0,
        total_no_question: 0,
        predefined_questions: 
        {
            no_of_predefined_questions: '',
            already_selected_question: [],
            newly_created_questions: []
        },
        random_questions:
        {
            no_of_random_question: 0,
            technologies:
            [
                {
                    technology_key: "python-key",
                    question_type_details:
                    {
                        mcq: 0
                    }
                }
            ]
        }
}