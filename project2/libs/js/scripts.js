document.addEventListener('DOMContentLoaded', function() {
  fetch('libs/php/getAllDepartments.php')
  .then(response => response.json())
  .then(data => {
      if (data.status.code === "200") {
          const departmentTableBody = document.getElementById('departmentTableBody');
          data.data.forEach(department => {
              const row = document.createElement('tr');

              const nameCell = document.createElement('td');
              nameCell.className = 'align-middle text-nowrap';
              nameCell.textContent = department.name;

              const locationCell = document.createElement('td');
              locationCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
              locationCell.textContent = department.locationID; // Assuming locationID is the location name. Adjust if needed.

              const actionCell = document.createElement('td');
              actionCell.className = 'align-middle text-end text-nowrap';

              const editButton = document.createElement('button');
              editButton.type = 'button';
              editButton.className = 'btn btn-success btn-sm';
              editButton.setAttribute('data-bs-toggle', 'modal');
              editButton.setAttribute('data-bs-target', '#editDepartmentModal');
              editButton.setAttribute('data-id', department.id);
              editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

              const deleteButton = document.createElement('button');
              deleteButton.type = 'button';
              deleteButton.className = 'btn btn-success btn-sm deleteDepartmentBtn';
              deleteButton.setAttribute('data-id', department.id);
              deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

              actionCell.appendChild(editButton);
              actionCell.appendChild(deleteButton);

              row.appendChild(nameCell);
              row.appendChild(locationCell);
              row.appendChild(actionCell);

              departmentTableBody.appendChild(row);
          });
      } else {
          console.error('Failed to fetch departments:', data.status.description);
      }
  })
  .catch(error => console.error('Error fetching departments:', error));
});

document.addEventListener('DOMContentLoaded', function() {
  fetch('libs/php/getAllPersonnels.php')
      .then(response => response.json())
      .then(data => {
          if (data.status.code === "200") {
              const personnelTableBody = document.getElementById('personnelTableBody');
              data.data.forEach(person => {
                  const row = document.createElement('tr');

                  const nameCell = document.createElement('td');
                  nameCell.className = 'align-middle text-nowrap';
                  nameCell.textContent = `${person.lastName}, ${person.firstName}`;

                  const departmentCell = document.createElement('td');
                  departmentCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
                  departmentCell.textContent = `${person.department}`;

                  const locationCell = document.createElement('td');
                  locationCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
                  locationCell.textContent = `${person.location}`;

                  const emailCell = document.createElement('td');
                  emailCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
                  emailCell.textContent = `${person.email}`;

                  const actionCell = document.createElement('td');
                  actionCell.className = 'text-end text-nowrap';

                  const editButton = document.createElement('button');
                  editButton.type = 'button';
                  editButton.className = 'btn btn-success btn-sm';
                  editButton.setAttribute('data-bs-toggle', 'modal');
                  editButton.setAttribute('data-bs-target', '#editPersonnelModal');
                  editButton.setAttribute('data-id', person.id);
                  editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

                  const deleteButton = document.createElement('button');
                  deleteButton.type = 'button';
                  deleteButton.className = 'btn btn-success btn-sm';
                  deleteButton.setAttribute('data-bs-toggle', 'modal');
                  deleteButton.setAttribute('data-bs-target', '#deletePersonnelModal');
                  deleteButton.setAttribute('data-id', person.id);
                  deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

                  actionCell.appendChild(editButton);
                  actionCell.appendChild(deleteButton);

                  row.appendChild(nameCell);
                  row.appendChild(departmentCell);
                  row.appendChild(locationCell);
                  row.appendChild(emailCell);
                  row.appendChild(actionCell);

                  personnelTableBody.appendChild(row);
              });
          } else {
              console.error('Failed to fetch personnel:', data.status.description);
          }
      })
      .catch(error => console.error('Error fetching personnel:', error));
});

document.addEventListener('DOMContentLoaded', function() {
  fetch("libs/php/getAllLocations.php")
  .then(response => response.json())
  .then(data => {
      if (data.status.code === "200") {
          const locationTableBody = document.getElementById('locationTableBody');
          data.data.forEach(location => {
              const row = document.createElement('tr');

              const nameCell = document.createElement('td');
              nameCell.className = 'align-middle text-nowrap';
              nameCell.textContent = location.name;

              const actionCell = document.createElement('td');
              actionCell.className = 'align-middle text-end text-nowrap';

              const editButton = document.createElement('button');
              editButton.type = 'button';
              editButton.className = 'btn btn-success btn-sm';
              editButton.setAttribute('data-bs-toggle', 'modal');
              editButton.setAttribute('data-bs-target', '#editLocationModal');
              editButton.setAttribute('data-id', location.id);
              editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

              const deleteButton = document.createElement('button');
              deleteButton.type = 'button';
              deleteButton.className = 'btn btn-success btn-sm deleteLocationBtn';
              deleteButton.setAttribute('data-id', location.id);
              deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

              actionCell.appendChild(editButton);
              actionCell.appendChild(deleteButton);

              row.appendChild(nameCell);
              row.appendChild(actionCell);

              locationTableBody.appendChild(row);
          });
      } else {
          console.error('Failed to fetch locations:', data.status.description);
      }
  })
  .catch(error => console.error('Error fetching locations:', error));
});

$("#searchInp").on("keyup", function () {
  
    // your code
    
  });
  
  $("#refreshBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      
      // Refresh personnel table
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        // Refresh department table
        
      } else {
        
        // Refresh location table
        
      }
      
    }
    
  });
  
  $("#filterBtn").click(function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").click(function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });

  $("#personnelBtn").click(function () {
    
    // Call function to refresh peronsal table
    
  });  

  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    
  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    
  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url:
        "https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  
  $("#editPersonnelForm").on("submit", function (e) {
    
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour
  
    e.preventDefault();
  
    // AJAX call to save form data
    
  });