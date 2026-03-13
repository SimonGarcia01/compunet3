```bash
// ========================
// TABLES
// ========================

Table survey {
  id int [pk]
  name varchar
  intro text
  validation varchar
  image_url varchar
  outro text
  styles text
}

Table section {
  id int [pk]
  title varchar
  description text
  flag varchar
  order_col int
  section_id int
  type varchar
  survey_id int
  background_image varchar
}

Table question {
  id int [pk]
  name varchar
  question_id int
  type varchar
  section_id int
  order_col int
}

Table option {
  id int [pk]
  name varchar
  type varchar
  group_id int
}

Table option_group {
  id int [pk]
  name varchar
}

Table option_question {
  id int [pk]
  question_id int
  option_id int
  group_id int
}

Table answer {
  id int [pk]
  answer text
  question_id int
  interview_id int
}

Table interview {
  id int [pk]
  time_start timestamp
  survey_id int
  interviewer_id int
  time_end timestamp
  username varchar
  institution_id int
}

Table type {
  id int [pk]
  name varchar
  description text
  table_name varchar
}

// ========================
// RELATIONSHIPS
// ========================

Ref: section.survey_id > survey.id
Ref: section.section_id > section.id

Ref: question.section_id > section.id
Ref: question.question_id > question.id

Ref: option.group_id > option_group.id

Ref: option_question.question_id > question.id
Ref: option_question.option_id > option.id
Ref: option_question.group_id > option_group.id

Ref: answer.question_id > question.id
Ref: answer.interview_id > interview.id

Ref: interview.survey_id > survey.id

Ref: question.type > type.name
```
