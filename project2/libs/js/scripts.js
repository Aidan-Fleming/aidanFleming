function populatePersonnel(query = '') {
  fetch('libs/php/getAllPersonnels.php')
    .then(response => response.json())
    .then(data => {
      if (data.status.code === "200") {
        const personnelTableBody = document.getElementById('personnelTableBody');
        personnelTableBody.innerHTML = ''; // Clear existing rows

        data.data.forEach(personnel => {
          const matchQuery = query.toLowerCase();
          const fullName = `${personnel.lastName}, ${personnel.firstName}`.toLowerCase();
          const departmentName = personnel.departmentName.toLowerCase();
          const locationName = personnel.locationName.toLowerCase();
          const email = personnel.email.toLowerCase();

          if (fullName.includes(matchQuery) || departmentName.includes(matchQuery) || locationName.includes(matchQuery) || email.includes(matchQuery)) {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.className = 'align-middle text-nowrap';
            nameCell.textContent = `${personnel.lastName}, ${personnel.firstName}`;

            const departmentCell = document.createElement('td');
            departmentCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            departmentCell.textContent = personnel.departmentName;

            const locationCell = document.createElement('td');
            locationCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            locationCell.textContent = personnel.locationName;

            const emailCell = document.createElement('td');
            emailCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            emailCell.textContent = personnel.email;

            const actionCell = document.createElement('td');
            actionCell.className = 'text-end text-nowrap';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-success btn-sm';
            editButton.setAttribute('data-bs-toggle', 'modal');
            editButton.setAttribute('data-bs-target', '#editPersonnelModal');
            editButton.setAttribute('data-id', personnel.id);
            editButton.setAttribute('data-firstname', personnel.firstName);
            editButton.setAttribute('data-lastname', personnel.lastName);
            editButton.setAttribute('data-departmentid', personnel.departmentID);
            editButton.setAttribute('data-email', personnel.email);
            editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

            // const deleteButton = document.createElement('button');
            // deleteButton.type = 'button';
            // deleteButton.className = 'btn btn-success btn-sm deletePersonnelBtn';
            // deleteButton.setAttribute('data-bs-toggle', 'modal');
            // deleteButton.setAttribute('data-bs-target', '#deletePersonnel');
            // deleteButton.setAttribute('data-id', personnel.id);
            // deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

            // // Add event listener to delete button
            // deleteButton.addEventListener('click', function() {
            //   const personnelId = this.getAttribute('data-id');
            //   window.personnelToDelete = personnelId;
            //   $('#delConfirmPersonel').modal('show');
            // });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-success btn-sm deleteDepartmentBtn';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#delConfirmPersonel');
            deleteButton.setAttribute('data-id', personnel.id);
            deleteButton.setAttribute('data-firstname', personnel.firstName);
            deleteButton.setAttribute('data-lastname', personnel.lastName);
            deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

            // Add event listener to delete button
            deleteButton.addEventListener('click', function() {
                const personnelId = this.getAttribute('data-id');
                const fullName = this.getAttribute('data-firstName') + " " + this.getAttribute('data-lastName');

                var message = "Are you sure you want to delete <strong>" + fullName + "</strong>?";
  
                $('#delConfirmPersonel .modal-body').html(message);

                // Show the modal when the delete button is clicked
                $('#delConfirmPersonel').show();

                // Handle click on the confirm button inside the modal
                $('#delConfirmPersonnelBtn').click(function() {
                    // AJAX call to delete the department
                    $.ajax({
                        url: 'libs/php/deletePersonelByID.php', // Update this to the actual path of your PHP file
                        type: 'POST',
                        data: { id: personnelId },
                        success: function(response) {
                            
                            if (response.status.code === "200") {                              
                                populatePersonnel();
                                $('#deleteDepartmentModal').modal('hide');
                            } else {
                                alert("Failed to delete the department: " + response.status.description);
                            }
                        },
                        error: function(xhr, status, error) {
                            alert("An error occurred: " + status + " " + error);
                        }
                    });

                    // Hide the modal after the operation is complete
                    $('#deleteDepartmentModal').hide();
                });
            });

            // Add event listener to edit button
            editButton.addEventListener('click', function() {
              const personnelId = this.getAttribute('data-id');
              const firstName = this.getAttribute('data-firstname');
              const lastName = this.getAttribute('data-lastname');
              const departmentID = this.getAttribute('data-departmentid');
              const email = this.getAttribute('data-email');

              // Set the values in the edit form
              document.getElementById('editPersonnelEmployeeID').value = personnelId;
              document.getElementById('editPersonnelFirstName').value = firstName;
              document.getElementById('editPersonnelLastName').value = lastName;
              document.getElementById('editPersonnelDepartment').value = departmentID;
              document.getElementById('editPersonnelEmailAddress').value = email;
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(departmentCell);
            row.appendChild(locationCell);
            row.appendChild(emailCell);
            row.appendChild(actionCell);

            personnelTableBody.appendChild(row);
          }
        });
      } else {
        console.error('Failed to fetch personnel:', data.status.description);
      }
    })
    .catch(error => console.error('Error fetching personnel:', error));

  // Handle the confirm delete button click
  $(document).ready(function() {
    // Register the event listener once when the document is ready
    $('#delConfirmPersonnelBtn').click(function() {
      // Retrieve the stored personnel ID
      const personnelId = window.personnelToDelete;

      // AJAX call to delete the personnel
      $.ajax({
        url: 'libs/php/deletePersonelByID.php', // Update this to the actual path of your PHP file
        type: 'POST',
        data: { id: personnelId },
        success: function(response) {
         
          if (response.status.code === "200") {
            alert("Personnel deleted successfully.");
            
            populatePersonnel();
            $('#deletePersonnelModal').modal('hide');
          } else {
            alert("Failed to delete the personnel: " + response.status.description);
          }
        },
        error: function(xhr, status, error) {
          alert("An error occurred: " + status + " " + error);
        }
      });
    });
  });
}

function populateDepartments(query = '') {
  fetch('libs/php/getAllDepartments.php')
      .then(response => response.json())
      .then(data => {
          if (data.status.code === "200") {
              const departmentTableBody = document.getElementById('departmentTableBody');
              departmentTableBody.innerHTML = ''; // Clear existing rows

              data.data.forEach(department => {
                  // Check if query matches any part of the department data
                  const matchQuery = query.toLowerCase();
                  const departmentName = department.departmentName ? department.departmentName.toLowerCase() : ''; // Check for null
                  const locationName = department.locationName ? department.locationName.toLowerCase() : ''; // Check for null

                  if (departmentName.includes(matchQuery) || locationName.includes(matchQuery)) {
                      const row = document.createElement('tr');

                      const nameCell = document.createElement('td');
                      nameCell.className = 'align-middle text-nowrap';
                      nameCell.textContent = department.departmentName || ''; // Ensure departmentName is not null

                      const locationCell = document.createElement('td');
                      locationCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
                      locationCell.textContent = department.locationName || 'N/A'; // Default to 'N/A' if locationName is null

                      const actionCell = document.createElement('td');
                      actionCell.className = 'align-middle text-end text-nowrap';

                      const editButton = document.createElement('button');
                      editButton.type = 'button';
                      editButton.className = 'btn btn-success btn-sm';
                      editButton.setAttribute('data-bs-toggle', 'modal');
                      editButton.setAttribute('data-bs-target', '#editDepartmentModal');
                      editButton.setAttribute('data-id', department.id);
                      editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

                      // Add event listener to set the hidden input field when the edit button is clicked
                      editButton.addEventListener('click', function() {
                          const departmentId = this.getAttribute('data-id');
                          document.getElementById('editDepartmentID').value = departmentId;
                      });

                      const deleteButton = document.createElement('button');
                      deleteButton.type = 'button';
                      deleteButton.className = 'btn btn-success btn-sm deleteDepartmentBtn';
                      deleteButton.setAttribute('data-bs-toggle', 'modal');
                      deleteButton.setAttribute('data-bs-target', '#delConfirmDepartment');
                      deleteButton.setAttribute('data-id', department.id);
                      deleteButton.setAttribute('data-department-name', department.departmentName);
                      deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

                      // Add event listener to delete button
                      deleteButton.addEventListener('click', function() {
                        const departmentId = this.getAttribute('data-id');
                        const departmentName = this.getAttribute('data-department-name');
                        var message = "Are you sure you want to delete <strong>" + departmentName + "</strong>?";
                        
                        // Update the modal body text with the department name
                        $('#delConfirmDepartment .modal-body').html(message);

                        // Show the modal when the delete button is clicked
                        $('#delConfirmDepartment').modal('show');
                      
                        // Handle click on the confirm button inside the modal
                        $('#delConfirmDepartmentBtn').off('click').on('click', function() {
                            // AJAX call to delete the department
                            $.ajax({
                                url: 'libs/php/deleteDepartmentByID.php', // Update this to the actual path of your PHP file
                                type: 'POST',
                                data: { id: departmentId },
                                success: function(response) {
                                    if (response.status.code === "200") {
                                        populateDepartments();
                                        $('#deleteDepartmentModal').modal('hide');
                                    } else if (response.status.code === "400") {
                                        // Check for status 400 and update the modal content
                                        var departmentName = response.data.departmentName;
                                        var count = response.data.count;
                                        var message = "You cannot delete the entry of <strong>" + departmentName + "</strong>. There are <strong>" + count + "</strong> employees in that department.";
                                        $('#delBlockedDepartment .modal-body').html(message);
                                        $('#delBlockedDepartment').modal('show');
                                    } else {
                                        alert("Failed to delete the department: " + response.status.description);
                                    }
                                },
                                error: function(xhr, status, error) {
                                    alert("An error occurred: " + status + " " + error);
                                }
                            });
                        });
                    });

                      actionCell.appendChild(editButton);
                      actionCell.appendChild(deleteButton);

                      row.appendChild(nameCell);
                      row.appendChild(locationCell);
                      row.appendChild(actionCell);

                      departmentTableBody.appendChild(row);
                  }
              });
          } else {
              console.error('Failed to fetch departments:', data.status.description);
          }
      })
      .catch(error => console.error('Error fetching departments:', error));
}

function populateLocations(query = '') {
  fetch('libs/php/getAllLocations.php')
    .then(response => response.json())
    .then(data => {
      if (data.status.code === "200") {
        const locationTableBody = document.getElementById('locationTableBody');
        locationTableBody.innerHTML = ''; // Clear existing rows

        data.data.forEach(location => {
          // Check if query matches any part of the location data
          const matchQuery = query.toLowerCase();
          const locationName = location.name.toLowerCase();

          if (locationName.includes(matchQuery)) {
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
            editButton.setAttribute('data-name', location.name);
            editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-success btn-sm deleteLocationBtn';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#delConfirmLocation');
            deleteButton.setAttribute('data-id', location.id);
            deleteButton.setAttribute('data-location-name', location.name);
            deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';

            // Add event listener to delete button
            deleteButton.addEventListener('click', function() {
              const locationId = this.getAttribute('data-id');
              const locationName = this.getAttribute('data-location-name');
              var message = "Are you sure you want to delete <strong>" + locationName + "</strong>?";

              $('#delConfirmLocation .modal-body').html(message);
              
              // Show the modal when the delete button is clicked
              $('#delConfirmLocation').show();
              
              // Handle click on the confirm button inside the modal
              $('#delConfirmLocationBtn').click(function() {
                // AJAX call to delete the location
                $.ajax({
                  url: 'libs/php/deleteLocationByID.php', // Update this to the actual path of your PHP file
                  type: 'POST',
                  data: { id: locationId },
                  success: function(response) {
                    // The response is already an object, so no need to parse it
                    if (response.status.code === "200") {
                      populateLocations();
                      $('#delConfirmLocation').modal('hide');
                  } else if (response.status.code === "400") {       
                    $('#delConfirmLocation').modal('hide');               
                      // Check for status 400 and update the modal content
                      var name = response.data.name;
                      var count = response.data.count;
                      var message = "You cannot delete the entry of <strong>" + locationName + "</strong>. There are <strong>" + count + "</strong> departments in that location.";
                      $('#delBlockedLocation .modal-body').html(message);
                      $('#delBlockedLocation').modal('show');
                  } else {
                      alert("Failed to delete the location: " + response.status.description);
                  }
              },
                  error: function(xhr, status, error) {
                    alert("An error occurred: " + status + " " + error);
                  }
                });
                
                // Hide the modal after the operation is complete
                $('#deleteLocationModal').hide();
              });
            });

            // Add event listener to edit button
            editButton.addEventListener('click', function() {
              const locationId = this.getAttribute('data-id');
              const locationName = this.getAttribute('data-name');
              
              // Set the values in the edit form
              document.getElementById('editLocationID').value = locationId;
              document.getElementById('editLocationName').value = locationName;
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(actionCell);

            locationTableBody.appendChild(row);
          }
        });
      } else {
        console.error('Failed to fetch locations:', data.status.description);
      }
    })
    .catch(error => console.error('Error fetching locations:', error));
}

document.addEventListener('DOMContentLoaded', function() {
  populatePersonnel();
  populateDepartments();
  populatePersonnel();
});

$("#searchInp").on("keyup", function () {
  const query = $(this).val().toLowerCase(); // Get current search query

  // Call populatePersonnel with the current search query
  populatePersonnel(query);
  populateDepartments(query);
  populateLocations(query);
});

 
$("#refreshBtn").click(function () {
    
    if ($("#personnelBtn").hasClass("active")) {
      
       populatePersonnel();
      
    } else {
      
      if ($("#departmentsBtn").hasClass("active")) {
        
        populateDepartments();
        
      } else {
        
        populateLocations()
        
      }
      
    }
    
  });

$(document).ready(function() {
    $("#editDepartmentConfirm").click(function(event) {
        event.preventDefault(); // Prevent default button behavior

        // Get the values from the form fields
        const departmentName = $("#editDepartmentDropdown").val();
        const locationID = $("#editDepartmentLocation").val();
        const departmentId = $("#editDepartmentID").val();        

        if (
          !departmentName || departmentName.trim() === '' || 
          !locationID || locationID.trim() === '') {
          alert('Please fill out all fields.');
          return;
        }

        var locationIDToCity = {
          "London": "1",
          "New York": "2",
          "Paris": "3",
          "Munich": "4",
          "Rome": "5"
          };
      // Use the reverse mapping object to get city name based on location ID
      var cityNumber = locationIDToCity[locationID] || "Unknown";
        
        // AJAX request to update department
        $.ajax({
            url: 'libs/php/editDepartmentByID.php',
            type: 'POST',
            data: {
                id: departmentId,
                name: departmentName,
                locationID: cityNumber
            },
            dataType: 'json',
            success: function(response) {
                if (response.status.code === "200") {
                    alert('Department updated successfully!');
                    $('#editDepartmentModal').modal('hide'); // Hide the modal after successful update
                    populateDepartments();
                } else {
                    alert('Error: ' + response.status.description);
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr);
                alert('An error occurred: ' + status + ' ' + error);
            }
        });
    });
});

$(document).ready(function() {
  $("#editLocationConfirm").click(function(event) {
      event.preventDefault(); // Prevent default button behavior

      // Get the values from the form fields
      const locationName = $("#editLocationName").val();
      const locationId = $("#editLocationID").val(); // Retrieve the location ID from the hidden input

      if (
        !locationName || locationName.trim() === '') {
        alert('Please fill out the field.');
        return;
      }

      // AJAX request to update location
      $.ajax({
          url: 'libs/php/editLocationByID.php',
          type: 'POST',
          data: {
              id: locationId,
              name: locationName
          },
          dataType: 'json',
          success: function(response) {
              if (response.status.code === "200") {
                  alert('Location updated successfully!');
                  $('#editLocationModal').modal('hide');
                  populateLocations();
              } else {
                  alert('Error: ' + response.status.description);
              }
          },
          error: function(xhr, status, error) {
              console.error(xhr);
              alert('An error occurred: ' + status + ' ' + error);
          }
      });
  });
});


$(document).ready(function() {
  $("#editPersonnelConfirm").click(function(event) {
    // Prevent the form from submitting by default
    event.preventDefault();

    // Get the values from the form fields
    const firstName = $("#editPersonnelFirstName").val();
    const lastName = $("#editPersonnelLastName").val();
    const departmentName = $("#editPersonnelDepartment").val();
    const email = $("#editPersonnelEmailAddress").val();
    const personnelId = $("#editPersonnelEmployeeID").val();

    // Validate all fields are not empty
    if (!firstName || firstName.trim() === '' || 
          !lastName || lastName.trim() === '' || 
          !departmentName || departmentName.trim() === '' || 
          !email || email.trim() === '') {
          alert('Please fill out all fields.');
          return;
      }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address. Example: name@hotmail.com');
      return;
    }

    // Create a mapping object from department names to IDs
    var nameToDepartmentID = {
      "Human Resources": "1",
      "Sales": "2",
      "Marketing": "3",
      "Legal": "4",
      "Services": "5",
      "Research and Development": "6",
      "Product Management": "7",
      "Training": "8",
      "Support": "9",
      "Engineering": "10",
      "Accounting": "11",
      "Business Development": "12"
    };

    // Map department name to department ID
    var departmentID = nameToDepartmentID[departmentName] || "Unknown";
    
    // AJAX request to update personnel
    $.ajax({
      url: 'libs/php/editPersonelByID.php',
      type: 'POST',
      data: {
        id: personnelId,
        firstName: firstName,
        lastName: lastName,
        departmentID: departmentID,
        email: email
      },
      dataType: 'json',
      success: function(response) {
        if (response.status.code === "200") {
          alert('Personnel updated successfully!');
          $('#editPersonnelModal').modal('hide'); // Hide the modal after successful update
          populatePersonnel(); // Re-populate the table to reflect changes
        } else {
          alert('Error: ' + response.status.description);
        }
      },
      error: function(xhr, status, error) {
        console.error(xhr);
        alert('An error occurred: ' + status + ' ' + error);
      }
    });
  });
});

  
  function applyFilters() {
    // Get the selected values from dropdowns
    var departmentValue = document.getElementById("filterModalDepartment").value;
    var locationValue = document.getElementById("filterModalLocation").value;
    
    
    if(departmentValue === ""){      
      populatePersonnel(locationValue);
    } else if (locationValue=== ""){      
      populatePersonnel(departmentValue);
    } else {      
      populatePersonnel(locationValue);
      populatePersonnel(departmentValue);
    }
}

$("#filterSubmitBtn").click(function () {

  applyFilters()
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
});
  
$(document).ready(function() {
  $("#addBtn").click(function() {
    let targetModal = '';
    
    if ($("#personnelBtn").hasClass("active")) {
      targetModal = "#insertPersonnelModal";
    } else if ($("#departmentsBtn").hasClass("active")) {
      targetModal = "#insertDepartmentModal";
    } else if($("#locationsBtn").hasClass("active")) {
      targetModal = "#insertLocationModal";
    }
    
    if (targetModal) {
      // Manually show the modal
      $(targetModal).modal('show');
    }
  });
});

$(document).ready(function() {
  $("#insertPersonnelBtn").click(function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the values from the form fields
    var firstName = $("#insertPersonnelFirstName").val();
    var lastName = $("#insertPersonnelLastName").val();
    var departmentName = $("#insertPersonnelDepartment").val();
    var email = $("#insertPersonnelEmailAddress").val();

    // Validate all fields are not empty
    if (firstName.trim() === '' || lastName.trim() === '' || departmentName.trim() === '' || email.trim() === '') {
      alert('Please fill out all fields.');
      return;
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address. Example: name@hotmail.com');
      return;
    }

    // Create a mapping object from department names to IDs
    var nameToDepartmentID = {
      "Human Resources": "1",
      "Sales": "2",
      "Marketing": "3",
      "Legal": "4",
      "Services": "5",
      "Research and Development": "6",
      "Product Management": "7",
      "Training": "8",
      "Support": "9",
      "Engineering": "10",
      "Accounting": "11",
      "Business Development": "12"
    };

    // Map department name to department ID
    var departmentID = nameToDepartmentID[departmentName] || "Unknown";

    // Log the values to the console for debugging
    

    // AJAX request to insert personnel
    $.ajax({
      url: 'libs/php/insertPersonel.php',
      type: 'POST',
      data: {
        firstName: firstName,
        lastName: lastName,
        departmentID: departmentID,
        email: email
      },
      dataType: 'json',
      success: function(response) {        
        if (response.status.code === "200") {
          alert('Personnel added successfully!');
          // Optionally, you can perform actions after successful insertion
          populatePersonnel(); // Re-populate the table to reflect changes
        } else {
          alert('Error: ' + response.status.description);
        }
      },
      error: function(xhr, status, error) {
        console.error(xhr);
        alert('An error occurred: ' + status + ' ' + error);
      }
    });
  });
});

$(document).ready(function() {
  $("#insertDepartmentBtn").click(function() {
    var departmentName = $("#insertDepartmentName").val();
    var cityName = $("#insertDepartmentLocation").val(); // Assuming cityName is the user-selected city name

    if (departmentName.trim() === '' || cityName.trim() === '') {
      alert('Please fill out all fields.');
      return;
    }
    
    var locationID;
    
    // Create a reverse mapping object
    var cityToLocationID = {
        "London": "1",
        "New York": "2",
        "Paris": "3",
        "Munich": "4",
        "Rome": "5"
    };
    
    // Use the reverse mapping object to get locationID based on cityName
    locationID = cityToLocationID[cityName] || "Unknown";      

      // Perform AJAX request
      $.ajax({
          url: 'libs/php/insertDepartment.php',
          type: 'POST', // Use POST since you are sending data
          data: {
              name: departmentName,
              locationID: locationID
          },
          dataType: 'json',
          success: function(response) {              
              if (response.status.code === "200") {
                  alert('Department added successfully!');
                  // Optionally, you can perform actions after successful insertion
                  populateDepartments();
              } else {
                  alert('Error: ' + response.status.description);
              }
          },
          error: function(xhr, status, error) {
              console.error(xhr);
              alert('An error occurred: ' + status + ' ' + error);
          }
      });
  });populateDepartments()
});

$(document).ready(function() {
  $("#insertLocationBtn").click(function() {
      var locationName = $("#insertLocationName").val();

      if (locationName.trim() === '') {
        alert('Please fill out the field.');
        return;
      }      

      // Perform AJAX request
      $.ajax({
          url: 'libs/php/insertLocation.php',
          type: 'POST', // Use POST since you are sending data
          data: {
              name: locationName,
          },
          dataType: 'json',
          success: function(response) {              
              if (response.status.code === "200") {
                  alert('Location added successfully!');
                  // Optionally, you can perform actions after successful insertion
                  populateLocations()
              } else {
                  alert('Error: ' + response.status.description);
              }
          },
          error: function(xhr, status, error) {
              console.error(xhr);
              alert('An error occurred: ' + status + ' ' + error);
          }
      });
  });
});


  $("#personnelBtn").click(function () {
    
    // Call function to refresh peronsal table
    populatePersonnel();
    
  });  

  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    populateDepartments();
    
  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    populateLocations();
    
  });


 // Filter Button Here
  document.addEventListener('DOMContentLoaded', function() {
    var filterModal = new bootstrap.Modal(document.getElementById('filterModal'), {
      backdrop: 'static', // prevents closing modal by clicking outside of it
      keyboard: false     // prevents closing modal by pressing Esc key
    });

    var filterBtn = document.getElementById('filterBtn');
    filterBtn.addEventListener('click', function() {
      filterModal.show();
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Function to populate Department dropdown
    function populateDepartmentDropdown() {
        // Fetch departments
        fetch('libs/php/getAllDepartments.php')
            .then(response => response.json())
            .then(data => {
                if (data.status.code === "200") {
                    // Populate filterModalDepartment dropdown
                    const filterModalDepartmentDropdown = document.querySelector("#filterModalDepartment");
                    filterModalDepartmentDropdown.innerHTML = "";

                    // Add empty option
                    const emptyOptionFilterModal = document.createElement("option");
                    emptyOptionFilterModal.value = "";
                    emptyOptionFilterModal.textContent = "-";
                    filterModalDepartmentDropdown.appendChild(emptyOptionFilterModal);

                    // Populate dropdown options
                    data.data.forEach(item => {
                        if (item.departmentName !== "Not used") {
                            const option = document.createElement("option");
                            option.value = item.departmentName;
                            option.textContent = item.departmentName;
                            filterModalDepartmentDropdown.appendChild(option);
                        }
                    });

                    // Populate insertPersonnelDepartment dropdown
                    const insertPersonnelDepartmentDropdown = document.querySelector("#insertPersonnelDepartment");
                    insertPersonnelDepartmentDropdown.innerHTML = "";

                    // Populate dropdown options
                    data.data.forEach(item => {
                        if (item.departmentName !== "Not used") {
                            const option = document.createElement("option");
                            option.value = item.departmentName;
                            option.textContent = item.departmentName;
                            insertPersonnelDepartmentDropdown.appendChild(option);
                        }
                    });

                    // Populate editDepartmentDropdown
                    const editDepartmentDropdown = document.querySelector("#editDepartmentDropdown");
                    editDepartmentDropdown.innerHTML = "";

                    // Populate dropdown options
                    data.data.forEach(item => {
                        if (item.departmentName !== "Not used") {
                            const option = document.createElement("option");
                            option.value = item.departmentName;
                            option.textContent = item.departmentName;
                            editDepartmentDropdown.appendChild(option);
                        }
                    });

                    // Populate editPersonnelDepartment dropdown
                    const editPersonnelDepartmentDropdown = document.querySelector("#editPersonnelDepartment");
                    editPersonnelDepartmentDropdown.innerHTML = "";

                    // Populate dropdown options
                    data.data.forEach(item => {
                      if (item.departmentName !== "Not used") {
                          const option = document.createElement("option");
                          option.value = item.departmentName;
                          option.textContent = item.departmentName;
                          editPersonnelDepartmentDropdown.appendChild(option);
                      }
                  });

                } else {
                    // Handle error for filterModalDepartment dropdown
                    document.querySelector("#filterModalDepartment").innerHTML = '<option value="">Error retrieving departments</option>';
                    // Handle error for insertPersonnelDepartment dropdown
                    document.querySelector("#insertPersonnelDepartment").innerHTML = '<option value="">Error retrieving departments</option>';
                    // Handle error for editDepartmentDropdown
                    document.querySelector("#editDepartmentDropdown").innerHTML = '<option value="">Error retrieving departments</option>';
                    // Handle error for editPersonnelDepartment dropdown
                    document.querySelector("#editPersonnelDepartment").innerHTML = '<option value="">Error retrieving departments</option>';
                }
            })
            .catch(error => {
                // Handle fetch error for filterModalDepartment dropdown
                document.querySelector("#filterModalDepartment").innerHTML = '<option value="">Error retrieving departments</option>';
                // Handle fetch error for insertPersonnelDepartment dropdown
                document.querySelector("#insertPersonnelDepartment").innerHTML = '<option value="">Error retrieving departments</option>';
                // Handle fetch error for editDepartmentDropdown
                document.querySelector("#editDepartmentDropdown").innerHTML = '<option value="">Error retrieving departments</option>';
                // Handle fetch error for editPersonnelDepartment dropdown
                document.querySelector("#editPersonnelDepartment").innerHTML = '<option value="">Error retrieving departments</option>';
            });
    }

    // Function to populate Location dropdown
    function populateLocationDropdown() {
        fetch('libs/php/getAllLocations.php')
            .then(response => response.json())
            .then(data => {
                if (data.status.code === "200") {
                    const locationDropdown = document.querySelector("#filterModalLocation");
                    locationDropdown.innerHTML = "";

                    // Add empty option
                    const emptyOption = document.createElement("option");
                    emptyOption.value = "";
                    emptyOption.textContent = "-";
                    locationDropdown.appendChild(emptyOption);

                    // Populate dropdown options
                    data.data.forEach(item => {
                        if (item.locationName !== "Not used") {
                            const option = document.createElement("option");
                            option.value = item.name;
                            option.textContent = item.name;
                            locationDropdown.appendChild(option);
                        }
                    });

                    // Populate insertDepartmentLocation dropdown
                    const insertDepartmentLocationDropdown = document.querySelector("#insertDepartmentLocation");
                    insertDepartmentLocationDropdown.innerHTML = "";

                    // Populate dropdown options
                    data.data.forEach(item => {
                        if (item.locationName !== "Not used") {
                            const option = document.createElement("option");
                            option.value = item.name;
                            option.textContent = item.name;
                            insertDepartmentLocationDropdown.appendChild(option);
                        }
                    });

                    // Populate editDepartmentLocation
                    const editDepartmentLocation = document.querySelector("#editDepartmentLocation");
                    editDepartmentLocation.innerHTML = "";

                    // Populate dropdown options
                    data.data.forEach(item => {
                        if (item.locationName !== "Not used") {
                            const option = document.createElement("option");
                            option.value = item.name;
                            option.textContent = item.name;
                            editDepartmentLocation.appendChild(option);
                        }
                    });
                } else {
                    document.querySelector("#filterModalLocation").innerHTML = '<option value="">Error retrieving locations</option>';
                    document.querySelector("#insertDepartmentLocation").innerHTML = '<option value="">Error retrieving locations</option>';
                    document.querySelector("#editDepartmentLocation").innerHTML = '<option value="">Error retrieving locations</option>';
                }
            })
            .catch(error => {
                document.querySelector("#filterModalLocation").innerHTML = '<option value="">Error retrieving locations</option>';
                document.querySelector("#insertDepartmentLocation").innerHTML = '<option value="">Error retrieving locations</option>';
                document.querySelector("#editDepartmentLocation").innerHTML = '<option value="">Error retrieving locations</option>';
            });
    }

    // Event listener for the button click to initiate dropdown population
    document.querySelector('#filterBtn').addEventListener('click', function() {
        populateDepartmentDropdown();
        populateLocationDropdown();
    });

    // Initial population of dropdowns and locations table
    populateDepartmentDropdown();
    populateLocationDropdown();
    populateLocations(); // Populate locations table initially
});




  
  
  
  




