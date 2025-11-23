drop database university;
create database university;

use university;

-- give permision to the user  
GRANT ALL PRIVILEGES ON university.* TO 'demo_user'@'localhost';

select * from users;

-- >>>>>> insert user with plain password 
-- insert into users values (
-- 1,
-- "mina@gmail.com",
-- "mina",
-- "pass",
-- "SUPER_ADMIN"
-- );

-- Insert with BCrypt encoded password for "pass"
INSERT INTO users (id, email, name, password, role) VALUES (
    1,
    "mina@gmail.com",
    "mina",
    "$2a$10$hXIduxgjevvlIpizVXSHIuULmtYcPxNoW5x49kBGxyQWzbY7ao5uy", -- BCrypt for "pass"
    "SUPER_ADMIN"
);

delete from users;

