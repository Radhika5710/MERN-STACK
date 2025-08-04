const mongoose = require('mongoose');
const readline = require('readline');

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/employeeDB';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  showMenu();
}).catch(err => console.error('❌ Connection Error:', err));

// Define Schema & Model
const employeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String
});
const Employee = mongoose.model('Employee', employeeSchema);

// CLI Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menu Function
function showMenu() {
  console.log(`\n--- Employee Management CLI ---
1. Insert Employee
2. View All Emploee
3. Update Employee
4. Delete Employee
5. Exit
-------------------------------`);
rl.question('Choose an option (1-5): ', handleMenu);
}

// Handle Menu Choices
function handleMenu(choice) {
  switch (choice.trim()) {
    case '1':
      insertEmployee();
      break;
    case '2':
      viewEmployees();
      break;
    case '3':
      updateEmployee();
      break;
    case '4':
      deleteEmployee();
      break;
    case '5':
      console.log('👋 Exiting...');
      rl.close();
      mongoose.disconnect();
      break;
    default:
      console.log('❌ Invalid choice. Try again.');
      showMenu();
  }
}
// Insert Student
function insertEmployee() {
  rl.question('Enter name: ', name => {
    rl.question('Enter age: ', age => {
      rl.question('Enter course: ', course => {
        const employee = new Employee({ name, age: Number(age), course });
        employee.save()
          .then(() => {
            console.log('✅ Employee inserted successfully.');
            showMenu();
          })
          .catch(err => {
            console.error('❌ Insert failed:', err);
            showMenu();
          });
      });
    });
  });
}

// View Students
function viewEmployees() {
  Employee.find()
    .then(employees => {
      console.log('\n📄 Employee Records:');
      employees.forEach((s, index) => {
        console.log('${index + 1}. ${s.name}, Age: ${s.age}, Course: ${s.course}, ID: ${s._id}');
      });
      showMenu();
    })
    .catch(err => {
      console.error('❌ Error fetching employees:', err);
      showMenu();
    });
}

// Update Employee
function updateEmployee() {
  rl.question('Enter Employee ID to update: ', id => {
    rl.question('New name: ', name => {
      rl.question('New age: ', age => {
        rl.question('New course: ', course => {
          Employee.findByIdAndUpdate(id, { name, age: Number(age), course }, { new: true })
            .then(updated => {
              if (updated) {
                console.log('✅ Employee updated.');
              } else {
                console.log('❌ No employee found with that ID.');
              }
              showMenu();
            })
            .catch(err => {
              console.error('❌ Update error:', err);
              showMenu();
            });
        });
      });
    });
  });
}

// Delete Employee
function deleteEmployee() {
  rl.question('Enter Employee ID to delete: ', id => {
    Employee.findByIdAndDelete(id)
      .then(deleted => {
        if (deleted) {
          console.log('🗑 Employee deleted.');
        } else {
          console.log('❌ No employee found with that ID.');
        }
        showMenu();
      })
      .catch(err => {
        console.error('❌ Delete error:', err);
        showMenu();
      });
    });
}
