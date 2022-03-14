INSERT INTO department (name)
VALUES ("Production"),
        ("Marketing"),
        ("Sales");


INSERT INTO role (title, salary, department_id)
VALUES ("Writer", 100000, 1),
        ("Graphic Designer", 100000, 2),
        ("Accountant", 100000, 3),
        ("Production Manager", 150000, 1),
        ("Marketing Manager", 150000, 2),
        ("Sales Manager", 150000, 3);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Pa", 4, NULL),
        ("Sam", "Adams", 1, 1),
        ("Hayley", "Lunsford", 6, NULL ),
        ("Quentin", "Tarantino", 3, 3);

