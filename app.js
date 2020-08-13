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
