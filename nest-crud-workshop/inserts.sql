-- Active: 1775184448658@@localhost@5433@mydatabase
-- =====================================================
-- Database Insertion Script
-- Order is important: tables with no dependencies first
-- =====================================================

-- =====================================================
-- 1. TYPES TABLE (no dependencies)
-- =====================================================
INSERT INTO types (name, description, table_name) VALUES
('Multiple Choice', 'Questions with single option selection', 'questions'),
('Text Input', 'Open-ended text response questions', 'questions'),
('Rating Scale', 'Numeric rating scale from 1-5', 'questions'),
('Dropdown Selection', 'Dropdown menu with predefined options', 'questions'),
('Checkbox', 'Multiple selection checkbox options', 'questions');

-- =====================================================
-- 2. OPTION_GROUPS TABLE (no dependencies)
-- =====================================================
INSERT INTO option_groups (name) VALUES
('Satisfaction Level'),
('Agreement Scale'),
('Frequency Options'),
('Rating Options'),
('Yes/No Options');

-- =====================================================
-- 3. PROJECTS TABLE (no dependencies - sectionId is just a number)
-- =====================================================
INSERT INTO projects (name, description, state, section_id, username, password) VALUES
('Customer Survey 2024', 'Annual customer satisfaction survey', 'A', 1, 'admin_survey1', 'pass123'),
('Employee Feedback', 'Employee engagement and feedback survey', 'A', 2, 'hr_manager', 'pass456'),
('Product Research', 'New product development research', 'A', 3, 'product_team', 'pass789'),
('Market Analysis', 'Market trends and customer preferences', 'I', 4, 'analyst_01', 'pass012'),
('Brand Perception', 'Brand awareness and perception study', 'A', 5, 'marketing_lead', 'pass345');

-- =====================================================
-- 4. SURVEYS TABLE (depends on projects)
-- =====================================================
INSERT INTO surveys (name, intro, outro, validation, image_url, styles, project_id) VALUES
('Customer Satisfaction Survey', 'Welcome to our survey! Your feedback helps us improve.', 'Thank you for completing the survey!', 'required', 'https://example.com/survey1.jpg', 'color: blue;', 1),
('Employee Engagement Survey', 'We value your opinion. Please take 10 minutes to complete this survey.', 'Your response has been recorded.', 'required', 'https://example.com/survey2.jpg', 'color: green;', 2),
('Product Research Survey', 'Help us understand your needs and preferences.', 'Thank you for your participation!', 'optional', 'https://example.com/survey3.jpg', 'color: orange;', 3),
('Market Analysis Survey', 'Quick survey about market trends (5 minutes).', 'Appreciation for your time!', 'required', 'https://example.com/survey4.jpg', 'color: purple;', 4),
('Brand Study Survey', 'Tell us what you think about our brand.', 'Thank you for your insights!', 'required', 'https://example.com/survey5.jpg', 'color: red;', 5);

-- =====================================================
-- 5. SECTIONS TABLE (depends on types and surveys)
-- =====================================================
INSERT INTO sections (title, description, tail, order_col, background_image, section_id, type_id, survey_id) VALUES
('Personal Information', 'Please provide your basic information', 'Next section', 1, 'https://example.com/bg1.jpg', NULL, 1, 1),
('Overall Satisfaction', 'How satisfied are you with our service?', 'Continue', 2, 'https://example.com/bg2.jpg', NULL, 3, 1),
('Company Culture', 'Tell us about your experience with company culture', 'Proceed', 1, 'https://example.com/bg3.jpg', NULL, 2, 2),
('Product Features', 'Which features are most important to you?', 'Next', 1, 'https://example.com/bg4.jpg', NULL, 1, 3),
('Final Comments', 'Any additional feedback or comments?', 'Complete', 3, 'https://example.com/bg5.jpg', NULL, 2, 5);

-- =====================================================
-- 6. QUESTIONS TABLE (depends on types and sections, self-referencing)
-- =====================================================
INSERT INTO questions (name, cod_quest, order_col, question_id, type_id, section_id) VALUES
('What is your age range?', 'Q001', 1, NULL, 1, 1),
('How long have you been with us?', 'Q002', 2, NULL, 2, 1),
('Rate your overall experience', 'Q003', 1, NULL, 3, 2),
('Which features do you use most?', 'Q004', 1, NULL, 1, 4),
('Any improvements you would suggest?', 'Q005', 1, NULL, 2, 5);

-- =====================================================
-- 7. OPTIONS TABLE (depends on option_groups and types)
-- =====================================================
INSERT INTO options (name, group_id, type_id) VALUES
('Very Satisfied', 1, 3),
('Satisfied', 1, 3),
('Neutral', 1, 3),
('Dissatisfied', 1, 3),
('Very Dissatisfied', 1, 3);

-- =====================================================
-- 8. METADATA TABLE (depends on questions)
-- =====================================================
INSERT INTO metadata (key, value, question_id) VALUES
('required', 'true', 1),
('hide_if_answered', 'false', 2),
('validation_pattern', '[0-9]{1,3}', 3),
('conditional_logic', 'show_if:age>18', 4),
('help_text', 'Please be as specific as possible', 5);

-- =====================================================
-- 9. OPTION_QUESTIONS TABLE (depends on questions, options, option_groups)
-- =====================================================
INSERT INTO option_questions (question_id, option_id, group_id) VALUES
(3, 1, 1),
(3, 2, 1),
(3, 3, 1),
(3, 4, 1),
(3, 5, 1);

-- =====================================================
-- 10. INTERVIEWS TABLE (depends on surveys)
-- =====================================================
INSERT INTO interviews (time_start, interviewer_id, time_end, username, institution_id, survey_id) VALUES
('2024-01-15 10:00:00', 'INT001', '2024-01-15 10:15:00', 'john_doe', 'INST001', 1),
('2024-01-16 14:30:00', 'INT002', '2024-01-16 14:45:00', 'jane_smith', 'INST002', 2),
('2024-01-17 09:00:00', 'INT003', '2024-01-17 09:20:00', 'mike_wilson', 'INST001', 3),
('2024-01-18 11:15:00', 'INT001', '2024-01-18 11:35:00', 'sarah_jones', 'INST003', 4),
('2024-01-19 16:00:00', 'INT004', '2024-01-19 16:10:00', 'robert_brown', 'INST002', 5);

-- =====================================================
-- 11. ASSIGNMENTS TABLE (depends on surveys)
-- =====================================================
INSERT INTO assignments (amount, user_id, survey_id) VALUES
(10, '101', 1),
(15, '102', 2),
(20, '103', 3),
(12, '104', 4),
(8, '105', 5);

-- =====================================================
-- 12. HOME_PAGES TABLE (depends on surveys)
-- =====================================================
INSERT INTO home_pages (background_image, welcome_message, survey_id) VALUES
('https://example.com/home1.jpg', 'Welcome to Customer Feedback!', 1),
('https://example.com/home2.jpg', 'Help us improve by sharing your thoughts', 2),
('https://example.com/home3.jpg', 'We want to know what you think', 3),
('https://example.com/home4.jpg', 'Market Research Study', 4),
('https://example.com/home5.jpg', 'Tell us about your brand experience', 5);

-- =====================================================
-- 13. ANSWERS TABLE (depends on questions and interviews)
-- =====================================================
INSERT INTO answers (answer, question_id, interview_id) VALUES
('18-25', 1, 1),
('2 years', 2, 1),
('Very satisfied', 3, 2),
('Dashboard and analytics', 4, 2),
('Add more customization options', 5, 3),
('25-34', 1, 4),
('6 months', 2, 4),
('Satisfied', 3, 5);

-- =====================================================
-- Summary: Total inserts
-- =====================================================
-- types: 5 rows
-- option_groups: 5 rows
-- projects: 5 rows
-- surveys: 5 rows
-- sections: 5 rows
-- questions: 5 rows
-- options: 5 rows
-- metadata: 5 rows
-- option_questions: 5 rows
-- interviews: 5 rows
-- assignments: 5 rows
-- home_pages: 5 rows
-- answers: 8 rows (extended for realistic relationships)
-- TOTAL: 68 rows
-- =====================================================
