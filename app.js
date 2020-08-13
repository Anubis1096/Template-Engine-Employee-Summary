const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

//Array to store employee info
class EmployeeInfo {
    constructor() {
        this.employees = [];
        this.currentEmployee = {
            name: "",
            id: "",
            email: "",
        }
    }
    //User input for employee info
    addEmployee() {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the employee's name?",
                name: "name"
            }, {
                type: "input",
                message: "What is the employee's ID?",
                name: "id"
            }, {
                type: "input",
                message: "What is the employee's email address?",
                name: "email"
            }, {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: ["Manager", "Engineer", "Intern"]
            }
        //Stores all info to currentEmployee object    
        ]).then(response => {
            this.currentEmployee.name = response.name;
            this.currentEmployee.id = response.id;
            this.currentEmployee.email = response.email;
            switch (response.role) {
                case "Manager":
                    this.addManagerInfo();
                    break;
                case "Engineer":
                    this.addEngineerInfo();
                    break;
                case "Intern":
                    this.addInternInfo();
            }
        })
    }
    //Adds role-specific information
    addManagerInfo() {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the manager's office number?",
                name: "officeNumber"
            }
        ]).then(response => {
            const manager = new Manager(this.currentEmployee.name, this.currentEmployee.id, this.currentEmployee.email, response.officeNumber);
            this.employees.push(manager);
            this.askToContinue();
        });
    }
    addEngineerInfo() {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the engineer's GitHub username?",
                name: "github"
            }
        ]).then(response => {
            const engineer = new Engineer(this.currentEmployee.name, this.currentEmployee.id, this.currentEmployee.email, response.github);
            this.employees.push(engineer);
            this.askToContinue();
        });
    }
    addInternInfo() {
        inquirer.prompt([
            {
                type: "input",
                message: "What school does the intern go to?",
                name: "school"
            }
        ]).then(response => {
            const intern = new Intern(this.currentEmployee.name, this.currentEmployee.id, this.currentEmployee.email, response.school);
            this.employees.push(intern);
            this.askToContinue();
        });
    }
    //Asks if user wants to add more employees
    askToContinue() {
        inquirer.prompt([
            {
                type: "confirm",
                message: "Add more employees?",
                name: "confirm"
            }
        ]).then(response => {
            if (response.confirm) {
                this.addEmployee();
            } else {
                this.quit();
            }
        })
    }

    render(path, data) {
        fs.writeFileSync(path, data, (error) => {
            if (error) throw error;
        });
    }

    quit() {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
            this.render(outputPath, render(this.employees));
        } else {
            this.render(outputPath, render(this.employees));
        }
        console.log("Done.");
        process.exit(0);
    }
}

const addEmployee = new EmployeeInfo();
addEmployee.addEmployee();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
