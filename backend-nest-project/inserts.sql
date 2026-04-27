-- ============================================================
-- Seed data para desarrollo — scholar-sync
-- Contraseña de TODOS los usuarios: Password123
-- Hash generado con bcrypt, salt rounds = 10
-- Deja roles y permisos incompletos a propósito para poder
-- probar los endpoints POST desde Postman
-- ============================================================

-- 1) users
--    Todos usan la misma contraseña: Password123
INSERT INTO users (email, password, first_name, last_name, profile_pic, major_1, major_2, xp, level) VALUES
('alice@example.com',   '$2b$10$R97gWO76R5TgXjRhl6jji.kxSRC0K8PhBkLAOfMfskAc1AMZHBz/2', 'Alice', 'Anderson', NULL, 'Software Engineering', NULL,        10, 1),
('bob@example.com',     '$2b$10$R97gWO76R5TgXjRhl6jji.kxSRC0K8PhBkLAOfMfskAc1AMZHBz/2', 'Bob',   'Brown',    NULL, 'Biology',              'Chemistry', 20, 2),
('carol@example.com',   '$2b$10$R97gWO76R5TgXjRhl6jji.kxSRC0K8PhBkLAOfMfskAc1AMZHBz/2', 'Carol', 'Clark',    NULL, 'Mathematics',          NULL,        30, 3),
('dave@example.com',    '$2b$10$R97gWO76R5TgXjRhl6jji.kxSRC0K8PhBkLAOfMfskAc1AMZHBz/2', 'Dave',  'Dawson',   NULL, 'Physics',              NULL,        40, 4),
('eve@example.com',     '$2b$10$R97gWO76R5TgXjRhl6jji.kxSRC0K8PhBkLAOfMfskAc1AMZHBz/2', 'Eve',   'Evans',    NULL, 'Chemistry',            'Biology',   50, 5);

-- 2) roles — solo Admin y Student pre-cargados
--    Libres para POST: 'TA' y 'Professor'
INSERT INTO roles (name, description) VALUES
('Admin',   'Administrator role with full access'),
('Student', 'Standard student role');

-- 3) permissions — solo Create y Read pre-cargados
--    Libres para POST: 'Update' y 'Delete'
INSERT INTO permissions (name, description) VALUES
('Create', 'Can create resources'),
('Read',   'Can read resources');

-- 4) roles_permissions
--    Admin (id 1) → Create (id 1), Read (id 2)
--    Student (id 2) → Read (id 2)
INSERT INTO roles_permissions (role_id, permission_id) VALUES
(1, 1),
(1, 2),
(2, 2);

-- 5) courses
INSERT INTO courses (name, credits, duration, start_date) VALUES
('Intro SE',    3, 12, '2026-02-01 09:00:00'),
('Biology 101', 4, 14, '2026-03-01 09:00:00'),
('Calculus I',  5, 16, '2026-04-01 09:00:00'),
('Physics I',   4, 12, '2026-05-01 09:00:00'),
('Chemistry I', 3, 10, '2026-06-01 09:00:00');

-- 6) users_courses
INSERT INTO users_courses (user_id, course_id, relation_type) VALUES
(1, 1, 'student'),
(2, 2, 'student'),
(3, 3, 'student'),
(4, 4, 'ta'),
(5, 5, 'student');

-- 7) users_roles
--    alice, bob, carol → Student
--    dave → Admin  (para poder probar rutas protegidas con rol Admin)
--    eve  → sin rol  (libre para probar POST /user-role)
INSERT INTO users_roles (user_id, role_id) VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 1);

-- 8) experience_badges
INSERT INTO experience_badges (name, min_level, message, associate_prices) VALUES
('Novice',       1,  'Welcome rookie', 'Sticker Pack'),
('Learner',      3,  'Keep going',     'Digital Certificate'),
('Intermediate', 6,  'Nice progress',  'Exclusive Avatar Frame'),
('Advanced',     10, 'Great work',     'Special Badge Highlight'),
('Expert',       20, 'Top performer',  'Access to VIP Forum');

-- 9) users_badges
INSERT INTO users_badges (user_id, experience_badge_id, date_acquired) VALUES
(1, 1, '2026-01-10 10:00:00'),
(2, 2, '2026-02-11 11:00:00'),
(3, 3, '2026-03-12 12:00:00');

-- 10) supplementary_sessions
INSERT INTO supplementary_sessions (requested_date, completed, topic, virtual) VALUES
('2026-02-20 09:00:00', false, 'Extra help 1', true),
('2026-03-21 10:00:00', true,  'Extra help 2', false),
('2026-04-22 11:00:00', false, 'Extra help 3', true);

-- 11) attendance_supp_sessions
--     dave (id 4) es el TA en todas
INSERT INTO attendance_supp_sessions (ta_id, student_id, supp_session_id, attendance_notes, additional_homework) VALUES
(4, 1, 1, 'Attended ok',   NULL),
(4, 2, 2, 'Attended late', NULL),
(4, 3, 3, 'Missed parts',  'Read chapter 1');

-- 12) posts
INSERT INTO posts (user_id, title, question, date_added) VALUES
(1, 'Help with HW',     'How do I solve problem 1?',    '2026-02-01 09:00:00'),
(2, 'Project question', 'How to structure my project?', '2026-03-01 10:00:00'),
(3, 'Exam tips',        'Best way to prepare?',         '2026-04-01 11:00:00');

-- 13) replies
INSERT INTO replies (post_id, user_id, reply_id, reply_message, date_added, likes, approvals) VALUES
(1, 2, NULL, 'Try starting with definitions', '2026-02-01 10:00:00', 0, 0),
(1, 3, 1,    'Also check examples',           '2026-02-01 11:00:00', 1, 0),
(2, 1, NULL, 'I used this guide',             '2026-03-01 11:30:00', 2, 1);

COMMIT;

