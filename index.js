const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // TODO: Add MySQL password here
  password: "Bearsman23!",
  database: "employee_db",
});

// functions
function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "commands",
        message: "choose what you would like to do",
        choices: [
          { name: "view all departments", value: "VIEWDEP" },
          { name: "view all employees", value: "VIEWEMP" },
          { name: "view all roles", value: "VIEWROL" },
          { name: "add a department", value: "ADDDEP" },
          { name: "add a role", value: "ADDROL" },
          { name: "add an employee", value: "ADDEMP" },
          { name: "update an employee role", value: "UPDEMP" },
          { name: "quit", value: "QUIT" },
        ],
      },
    ])
    .then((answers) => {
      console.log(answers);
      switch (answers.commands) {
        // function calls will run respective actions based on user's answers
        case "VIEWDEP":
          viewDepartments();
          break;
        case "VIEWEMP":
          viewEmployees();
          break;
        case "VIEWROL":
          viewRoles();
          break;
        case "ADDDEP":
          addDepartment();
          break;
        case "ADDEMP":
          addEmployee();
          break;
        case "ADDROL":
          addRole();
          break;
        case "UPDEMP":
          updateEmployee();
          break;
        case "QUIT":
          console.log("Goodbye");
          process.exit();
          break;

        default:
          console.log("no instances found");
          break;
      }
      // if (answers.commands === "VIEWDEP") {
      //   viewDepartments();
      // }
      // if (answers.commands === "VIEWEMP") {
      //   viewEmployees();
      // }
      // if (answers.commands === "VIEWROL") {
      //   viewRoles();
      // }
    });
}

// functions
function viewDepartments() {
  // selects everything from department
  const sql = "SELECT * FROM department";
  db.query(sql, (err, result) => {
    console.table(result);
    mainMenu();
  });
}

function viewEmployees() {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, result) => {
    console.table(result);
    mainMenu();
  });
}

function viewRoles() {
  const sql = "SELECT * FROM role";
  db.query(sql, (err, result) => {
    console.table(result);
    mainMenu();
  });
}
// these functions will add to the resepctive tables
function addDepartment() {
  // we need to collect the department name the user wants to add
  inquirer
    //   asks user questions in terminal
    // array of objects will be passed to the prompt method
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter your new department name",
      },
    ])
    .then((answers) => {
      console.log(answers);
      const sql = "INSERT INTO department (name) VALUES (?)";
      db.query(sql, answers.departmentName, (err, result) => {
        console.log(`Added ${answers.departmentName} to database!`);
        mainMenu();
      });
    });
  // once we have the name value, we want to insert it into our table

  // after it is updated, we want to direct them to the main menu
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What's the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What's the employee's last name?",
      },
    ])
    .then((answers) => {
      db.query("SELECT * FROM role", function (err, results) {
        const role = results.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        inquirer
          .prompt({
            type: "list",
            name: "id",
            message: "What is the employee's role?",
            choices: role,
          })
          .then((role) => {
            db.query("SELECT * FROM employee where manager_id is null", function (err, results) {
              const managers = results.map(({ id, last_name }) => ({
                name: last_name,
                value: id,
              }));
              inquirer
                .prompt({
                  type: "list",
                  name: "id",
                  message: "What is the manager's name?",
                  choices: managers,
                })
                .then((manager) => {
                  db.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)", [answers.firstName, answers.lastName, role.id, manager.id]);
                  mainMenu();
                });
            });
          });
      });
    });
}

function addRole() {
  const sql = "SELECT * FROM department";
  db.query(sql, (err, result) => {
    const departmentArr = result.map((department) => {
      return { name: department.name, value: department.id };
    });

    inquirer
      //   asks user questions in terminal
      // array of objects will be passed to the prompt method
      .prompt([
        {
          type: "input",
          name: "roleTitle",
          message: "Enter your new role",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Enter the role's salary.",
        },
        {
          type: "list",
          name: "departmentId",
          message: "What department does this role belong to? ",
          choices: departmentArr,
        },
      ])
      .then((answers) => {
        console.log(answers);
        const sql = "INSERT INTO role(title, salary, department_id) VALUES (?,?,?)";
        db.query(sql, [answers.roleTitle, answers.roleSalary, answers.departmentId], (err, result) => {
          console.log(`Added ${answers.roleTitle} to database!`);
          mainMenu();
        });
      });
  });
}

function updateEmployee() {
  db.query("SELECT * FROM employee", (err, result) => {
    const employeeArr = result.map(({ id, last_name }) => ({
      name: last_name,
      value: id,
    }));
    inquirer
      .prompt({
        name: "id",
        message: "Who's role would you like to update",
        type: "list",
        choices: employeeArr,
      })
      // promise
      .then((employee) => {
        db.query("SELECT * FROM role", function (err, results) {
          const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt({
              name: "id",
              message: "What is the employees new title?",
              type: "list",
              choices: roles,
            })
            .then((role) => {
              db.query("UPDATE employee SET role_id = ? WHERE id = ?", [role.id, employee.id], function (err, row) {});
              db.query("SELECT * FROM employee", (err, results) => {
                console.log("updated employee");
                mainMenu();
              });
            });
        });
      });
  });
}

mainMenu();
