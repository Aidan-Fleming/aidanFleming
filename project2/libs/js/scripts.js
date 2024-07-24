function populatePersonnel(query = '', department = '', location = '') {
  fetch('libs/php/getAllPersonnels.php')
    .then(response => response.json())
    .then(data => {
      if (data.status.code === "200") {
        const personnelTableBody = document.getElementById('personnelTableBody');
        personnelTableBody.innerHTML = ''; // Clear existing rows

        // Create a DocumentFragment to hold rows
        const fragment = document.createDocumentFragment();

        data.data.forEach(personnel => {
          const matchesQuery = (
            (!department || personnel.departmentID == department) &&
            (!location || personnel.locationID == location) &&
            (query === '' || 
              `${personnel.firstName} ${personnel.lastName}`.toLowerCase().includes(query) ||
              personnel.departmentName.toLowerCase().includes(query) ||
              personnel.locationName.toLowerCase().includes(query) ||
              personnel.email.toLowerCase().includes(query))
          );

          if (matchesQuery) {
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

            const jobTitleCell = document.createElement('td');
            jobTitleCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            jobTitleCell.textContent = personnel.jobTitle;

            const actionCell = document.createElement('td');
            actionCell.className = 'text-end text-nowrap';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-primary btn-sm';
            editButton.setAttribute('data-bs-toggle', 'modal');
            editButton.setAttribute('data-bs-target', '#editPersonnelModal');
            editButton.setAttribute('data-id', personnel.id);
            editButton.setAttribute('data-firstname', personnel.firstName);
            editButton.setAttribute('data-lastname', personnel.lastName);
            editButton.setAttribute('data-departmentid', personnel.departmentID);
            editButton.setAttribute('data-jobTitle', personnel.jobTitle);
            editButton.setAttribute('data-email', personnel.email);
            editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-primary btn-sm deletePersonnelButton';
            deleteButton.setAttribute('data-id', personnel.id);
            deleteButton.setAttribute('data-firstname', personnel.firstName);
            deleteButton.setAttribute('data-lastname', personnel.lastName);
            deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
            deleteButton.style.marginLeft = '0.3rem';

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
            row.appendChild(jobTitleCell);
            row.appendChild(emailCell);
            row.appendChild(actionCell);

            // Append the row to the fragment
            fragment.appendChild(row);
          }
        });

        // Append the fragment to the table body
        personnelTableBody.appendChild(fragment);
      } else {
        console.error('Failed to fetch personnel:', data.status.description);
      }
    })
    .catch(error => console.error('Error fetching personnel:', error));
}

  
function populateDepartments(query = '') {
  fetch('libs/php/getAllDepartments.php')
    .then(response => response.json())
    .then(data => {
      if (data.status.code === "200") {
        const departmentTableBody = document.getElementById('departmentTableBody');
        departmentTableBody.innerHTML = ''; // Clear existing rows

        // Create a DocumentFragment to hold rows
        const fragment = document.createDocumentFragment();

        data.data.forEach(department => {
          // Check if query matches any part of the department data
          const matchQuery = query.toLowerCase();
          const departmentName = department.departmentName ? department.departmentName.toLowerCase() : '';
          const locationName = department.locationName ? department.locationName.toLowerCase() : '';

          if (departmentName.includes(matchQuery) || locationName.includes(matchQuery)) {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.className = 'align-middle text-nowrap';
            nameCell.textContent = department.departmentName || '';

            const locationCell = document.createElement('td');
            locationCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            locationCell.textContent = department.locationName || 'N/A';

            const actionCell = document.createElement('td');
            actionCell.className = 'align-middle text-end text-nowrap';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'btn btn-primary btn-sm';
            editButton.setAttribute('data-bs-toggle', 'modal');
            editButton.setAttribute('data-bs-target', '#editDepartmentModal');
            editButton.setAttribute('data-id', department.id);
            editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

            // Add event listener to edit button
            editButton.addEventListener('click', function() {
              document.getElementById('editDepartmentID').value = this.getAttribute('data-id');
            });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-primary btn-sm deleteDepartmentBtn';
            deleteButton.setAttribute('data-id', department.id);
            deleteButton.setAttribute('data-department-name', department.departmentName);
            deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
            deleteButton.style.marginLeft = '0.3rem';

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(locationCell);
            row.appendChild(actionCell);

            // Append the row to the fragment
            fragment.appendChild(row);
          }
        });

        // Append the fragment to the table body
        departmentTableBody.appendChild(fragment);
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

        // Create a DocumentFragment to hold rows
        const fragment = document.createDocumentFragment();

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
            editButton.className = 'btn btn-primary btn-sm';
            editButton.setAttribute('data-bs-toggle', 'modal');
            editButton.setAttribute('data-bs-target', '#editLocationModal');
            editButton.setAttribute('data-id', location.id);
            editButton.setAttribute('data-name', location.name);
            editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';

            // Add event listener to edit button
            editButton.addEventListener('click', function() {
              document.getElementById('editLocationID').value = this.getAttribute('data-id');
              document.getElementById('editLocationName').value = this.getAttribute('data-name');
            });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn btn-primary btn-sm deleteLocationBtn';
            deleteButton.setAttribute('data-id', location.id);
            deleteButton.setAttribute('data-name', location.name);
            deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
            deleteButton.style.marginLeft = '0.3rem';

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(actionCell);

            // Append the row to the fragment
            fragment.appendChild(row);
          }
        });

        // Append the fragment to the table body
        locationTableBody.appendChild(fragment);
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
    const query = $(this).val().toLowerCase();
  
    // Call populatePersonnel with the current search query
    populatePersonnel(query);    
});
  
$("#refreshBtn").click(function () {
    // Clear the search input field
    $("#searchInp").val('');
    $("#filterPersonnelByDepartment").val('Any');
    $("#filterPersonnelByLocation").val('Any');
  
    if ($("#personnelBtn").hasClass("active")) {
      populatePersonnel();
    } else if ($("#departmentsBtn").hasClass("active")) {
      populateDepartments();
    } else {
      populateLocations();
    }
});
  
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  
    $.ajax({
      url:
        "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
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

$("#editPersonnelModal").on("submit", function (e) {

      const id = $("#editPersonnelEmployeeID").val();
      const firstName = $("#editPersonnelFirstName").val();
      const lastName = $("#editPersonnelLastName").val();
      const jobTitle = $("#editPersonnelJobTitle").val();
      const departmentID = $("#editPersonnelDepartment").val();
      const email = $("#editPersonnelEmailAddress").val();

      e.preventDefault();
      
      // AJAX request to update personnel
      $.ajax({
        url: 'libs/php/editPersonelByID.php',
        type: 'POST',
        dataType: "json",
        data: {
          id: id,
          firstName: firstName,
          lastName: lastName,
          jobTitle: jobTitle,
          departmentID: departmentID,
          email: email
        },        
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
  
$("#editDepartmentModal").on("show.bs.modal", function (e)  {
    $.ajax({
      url:
        "libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
        var resultCode = result.status.code;        
  
        if (resultCode == 200) {          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted

          $("#editDepartmentName").val(result.data.department[0].name);                 

          $("#editDepartmentLocation").html("");
  
          $.each(result.data.location, function () {
            $("#editDepartmentLocation").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });

          $("#editDepartmentLocation").val(result.data.department[0].locationID);
          
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
})
});

$("#editDepartmentModal").on("submit", function(e)  {

        const departmentName = $("#editDepartmentName").val();
        const location = $("#editDepartmentLocation").val();
        const departmentId = $("#editDepartmentID").val();     

        e.preventDefault();

      $.ajax({
        url: 'libs/php/editDepartmentByID.php',
        type: 'POST',
        data: {
            id: departmentId,
            name: departmentName,
            locationID: location
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

$("#editLocationModal").on("show.bs.modal", function (e) {
  $.ajax({
    url:
      "libs/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;        

      if (resultCode == 200) {          
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editLocationName").val(result.data.department[0].name);       
        $("#editLocationID").val(result.data.department[0].locationID);
        
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
})
});

$("#editLocationModal").on("submit", function(e)  {

    const locationName =  $("#editLocationName").val();
    const locationId = $("#editLocationID").val();

    e.preventDefault();
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

var currentfilterDepartmentSelect
var currentfilterLocationSelect

$("#filterModal").on("show.bs.modal", function () {
  
  $.ajax({
    url:
      "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",    
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {      
        
        var currentfilterDepartmentSelect = $('#filterPersonnelByDepartment').val(); 

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#filterPersonnelByDepartment").html("");

        $("#filterPersonnelByDepartment").append(
          $("<option>", {
            value: "", // You can set the value to any identifier you want
            text: "Any"
          })
        );

        $.each(result.data, function () {
          $("#filterPersonnelByDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.departmentName
            })
          );
        });
        
        $('#filterPersonnelByDepartment').val(currentfilterDepartmentSelect); 

        
      } else {
        $("#filterModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
  $.ajax({
    url:
      "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",    
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        var currentfilterLocationSelect = $('#filterPersonnelByLocation').val();
        
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        
        $("#filterPersonnelByLocation").html("");

        $("#filterPersonnelByLocation").append(
          $("<option>", {
            value: "", // You can set the value to any identifier you want
            text: "Any"
          })
        );

        $.each(result.data, function () {
          $("#filterPersonnelByLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $('#filterPersonnelByLocation').val(currentfilterLocationSelect);
        
      } else {
        $("#filterModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#filterModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });  
});

var selectedDepartment;
var selectedLocation;

$('#filterModal').on('hidden.bs.modal', function () {
  // Preserve the selected values when the modal is hidden
  $('#filterDepartmentSelect').val(currentfilterDepartmentSelect); 
  $('#filterLocation').val(currentfilterLocationSelect);
});

$('#filterPersonnelByDepartment').on('change', function() {
  $("#filterPersonnelByLocation").val('');
  applyDepFilters();  
});

$('#filterPersonnelByLocation').on('change', function() {
  $("#filterPersonnelByDepartment").val('');  
  applyLocFilters();
});

function applyDepFilters() {
  const selectedDepartment = $('#filterPersonnelByDepartment').val();
  const selectedLocation = $('#filterPersonnelByLocation').val();
  const query = $("#searchInp").val().toLowerCase(); // Get current search query
  populatePersonnel(query, selectedDepartment, selectedLocation);
}

function applyLocFilters() {
  const selectedDepartment = $('#filterPersonnelByDepartment').val();
  const selectedLocation = $('#filterPersonnelByLocation').val();
  const query = $("#searchInp").val().toLowerCase(); // Get current search query
  populatePersonnel(query, selectedDepartment, selectedLocation);
}


$(document).on('click', '.deletePersonnelButton', function() {
  
  $.ajax({
    url:
      "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(this).attr("data-id") // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        $('#areYouSurePersonnelID').val(result.data.personnel[0].id);
        $("#areYouSurePersonnelName").text(
          result.data["personnel"][0].firstName +
            " " +
            result.data["personnel"][0].lastName
        );

        $("#areYouSurePersonnelModal").modal("show");
      } else {
        $("#areYouSurePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteEmployeeName .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

$(document).on("submit", "#areYouSurePersonnelForm", function(event) {
  event.preventDefault(); // Prevent the default form submission

  const personnelId = $('#areYouSurePersonnelID').val();

  $.ajax({
    url: 'libs/php/deletePersonelByID.php', // Update this to the actual path of your PHP file
    type: 'POST',
    data: { id: personnelId }, // Retrieves the data-id attribute from the form input
    success: function(response) {
      if (response.status.code === "200") {
        populatePersonnel(); // Refresh the personnel list
        $('#areYouSurePersonnelModal').modal('hide'); // Hide the modal after successful deletion
      } else {
        alert("Failed to delete the personnel: " + response.status.description);
      }
    },
    error: function(xhr, status, error) {
      alert("An error occurred: " + status + " " + error);
    }
  });
});

$(document).on('click', '.deleteDepartmentBtn', function() {
  var id = $(this).attr('data-id');
  $.ajax({
    url: "libs/php/checkDepartmentUse.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      
      if (result.status.code == 200) {

        if (result.data[0].personnelCount == 0) {
          $("#areYouSureDepartmentName").text(result.data[0].departmentName);
          $("#areYouSureDepartmentModal").data('id', id);

          // Ensure the jQuery object context is correct
          $("#areYouSureDepartmentModal").modal("show");
        } else {
          $("#cantDeleteDeptName").text(result.data[0].departmentName);
          $("#personnelCount").text(result.data[0].personnelCount);

          // Ensure the jQuery object context is correct
          $("#cantDeleteDepartmentModal").modal("show");
        }
      } else {
        $("#cantDeleteDepartmentModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#areYouSureDeptName .modal-title").replaceWith("Error retrieving data");
    }
  });
});

$(document).on("submit", "#areYouSureDepartmentModal", function(e) {
  event.preventDefault(); // Prevent the default form submission

  var id = $(this).data('id');  

  $.ajax({
    url: 'libs/php/deleteDepartmentByID.php', // Update this to the actual path of your PHP file
    type: 'POST',
    data: { id: id }, // Retrieves the data-id attribute from the form input
    success: function(response) {
      if (response.status.code === "200") {
        populateDepartments(); // Refresh the personnel list
        $('#areYouSurePersonnelModal').modal('hide'); // Hide the modal after successful deletion
      } else {
        alert("Failed to delete the personnel: " + response.status.description);
      }
    },
    error: function(xhr, status, error) {
      alert("An error occurred: " + status + " " + error);
    }
  });
});

$(document).on('click', '.deleteLocationBtn', function() {
  var id = $(this).attr('data-id');
  $.ajax({
    url:
      "libs/php/checkLocationUse.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id// Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      
      if (result.status.code == 200) {
        if (result.data[0].departmentCount == 0) {
          $("#areYouSureLocationName").text(result.data[0].LocationName);

          $("#areYouSureLocationModal").data('id', id);
          $("#areYouSureLocationModal").modal("show");
        } else {
          $("#cantDeleteLocName").text(result.data[0].LocationName);          
          $("#LocCount").text(result.data[0].departmentCount);

          $("#cantDeleteLocationModal").modal("show");
        }
      } else {
        $("#cantDeleteLocationModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#areYouSureDeptName .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

$(document).on("submit", "#areYouSureLocationModal", function(e) {
  event.preventDefault(); // Prevent the default form submission

  var id = $(this).data('id');  

  $.ajax({
    url: 'libs/php/deleteLocationByID.php', // Update this to the actual path of your PHP file
    type: 'POST',
    data: { id: id }, // Retrieves the data-id attribute from the form input
    success: function(response) {
      if (response.status.code === "200") {
        populateLocations(); // Refresh the personnel list
        $('#areYouSureLocatioModal').modal('hide'); // Hide the modal after successful deletion
      } else {
        alert("Failed to delete the location: " + response.status.description);
      }
    },
    error: function(xhr, status, error) {
      alert("An error occurred: " + status + " " + error);
    }
  });
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


$("#insertPersonnelModal").on("show.bs.modal", function(e)  {
    
    $.ajax({
      url:
        "libs/php/getAllDepartments.php",
      type: "POST",
      dataType: "json",    
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {       
  
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#insertPersonnelDepartment").html("");
  
          $.each(result.data, function () {
            $("#insertPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.departmentName
              })
            );
          });           
          
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
})

$("#insertPersonnelModal").on("submit", function(e)  {

  var firstName = $("#insertPersonnelFirstName").val();
  var lastName = $("#insertPersonnelLastName").val();
  var jobTitle = $("#insertPersonnelJobTitle").val();
  var department = $("#insertPersonnelDepartment").val();
  var email = $("#insertPersonnelEmailAddress").val();

  event.preventDefault(); // Prevent the default form submission


  $.ajax({
    url: 'libs/php/insertPersonel.php',
    type: 'POST',
    data: {
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle,
      departmentID: department,
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

})

$("#insertDepartmentModal").on("show.bs.modal", function(e)  {    
  $.ajax({
    url:
      "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",    
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted                       

        $("#insertDepartmentLocation").html("");

        $.each(result.data, function () {
          $("#insertDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });  
        
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
})

$("#insertDepartmentModal").on("submit", function(e)  {

  var departmentName = $("#insertDepartmentName").val();
  var LocationName = $("#insertDepartmentLocation").val();
  
  event.preventDefault(); // Prevent the default form submission


  $.ajax({
    url: 'libs/php/insertDepartment.php',
    type: 'POST', // Use POST since you are sending data
    data: {
        name: departmentName,
        locationID: LocationName
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

})

$("#insertLocationModal").on("submit", function(e)  {
    var locationName = $("#insertLocationName").val();

    event.preventDefault(); // Prevent the default form submission

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

  
  
$("#personnelBtn").click(function () {
      $("#filterBtn").attr("disabled", false);     
      
      // Call function to refresh peronsal table
      populatePersonnel();
      
});  
  
    
$("#departmentsBtn").click(function () {
      $("#filterBtn").attr("disabled", true);
      
      // Call function to refresh department table
      populateDepartments();
      
});
    
$("#locationsBtn").click(function () {
      $("#filterBtn").attr("disabled", true);
      
      // Call function to refresh location table
      populateLocations();
      
});
  
  
   // Filter Button Here
    document.addEventListener('DOMContentLoaded', function() {
      var filterModal = new bootstrap.Modal(document.getElementById('filterModal'), {
        keyboard: false     // prevents closing modal by pressing Esc key
      });
  
      var filterBtn = document.getElementById('filterBtn');
      filterBtn.addEventListener('click', function() {
        filterModal.show();
      });
    });
  
  
  
  
    
    
    
    
  
  
  
  
  