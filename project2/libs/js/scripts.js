$(document).ready(function() {
  // Function to populate personnel table
  function populatePersonnel(e="") {
      fetch("libs/php/getAllPersonnels.php")
          .then(response => response.json())
          .then(data => {
              if (data.status.code === "200") {
                  let personnelTableBody = document.getElementById("personnelTableBody");
                  personnelTableBody.innerHTML = "";
                  data.data.forEach(person => {
                      let fullName = `${person.lastName}, ${person.firstName}`.toLowerCase();
                      let departmentName = person.departmentName.toLowerCase();
                      let locationName = person.locationName.toLowerCase();
                      let email = person.email.toLowerCase();

                      if (fullName.includes(e.toLowerCase()) || departmentName.includes(e.toLowerCase()) ||
                          locationName.includes(e.toLowerCase()) || email.includes(e.toLowerCase())) {
                          
                          let row = document.createElement("tr");

                          let fullNameCell = document.createElement("td");
                          fullNameCell.className = "align-middle text-nowrap";
                          fullNameCell.textContent = `${person.lastName}, ${person.firstName}`;

                          let departmentCell = document.createElement("td");
                          departmentCell.className = "align-middle text-nowrap d-none d-md-table-cell";
                          departmentCell.textContent = person.departmentName;

                          let locationCell = document.createElement("td");
                          locationCell.className = "align-middle text-nowrap d-none d-md-table-cell";
                          locationCell.textContent = person.locationName;

                          let emailCell = document.createElement("td");
                          emailCell.className = "align-middle text-nowrap d-none d-md-table-cell";
                          emailCell.textContent = person.email;

                          let actionCell = document.createElement("td");
                          actionCell.className = "text-end text-nowrap";

                          let editButton = document.createElement("button");
                          editButton.type = "button";
                          editButton.className = "btn btn-success btn-sm";
                          editButton.setAttribute("data-bs-toggle", "modal");
                          editButton.setAttribute("data-bs-target", "#editPersonnelModal");
                          editButton.setAttribute("data-id", person.id);
                          editButton.setAttribute("data-firstname", person.firstName);
                          editButton.setAttribute("data-lastname", person.lastName);
                          editButton.setAttribute("data-departmentid", person.departmentID);
                          editButton.setAttribute("data-email", person.email);
                          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
                          editButton.addEventListener("click", function() {
                              let id = this.getAttribute("data-id");
                              let firstName = this.getAttribute("data-firstname");
                              let lastName = this.getAttribute("data-lastname");
                              let departmentID = this.getAttribute("data-departmentid");
                              let email = this.getAttribute("data-email");
                              
                              document.getElementById("editPersonnelEmployeeID").value = id;
                              document.getElementById("editPersonnelFirstName").value = firstName;
                              document.getElementById("editPersonnelLastName").value = lastName;
                              document.getElementById("editPersonnelDepartment").value = departmentID;
                              document.getElementById("editPersonnelEmailAddress").value = email;
                          });

                          let deleteButton = document.createElement("button");
                          deleteButton.type = "button";
                          deleteButton.className = "btn btn-success btn-sm deletePersonnelBtn";
                          deleteButton.setAttribute("data-bs-toggle", "modal");
                          deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal");
                          deleteButton.setAttribute("data-id", person.id);
                          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
                          deleteButton.addEventListener("click", function() {
                              let id = this.getAttribute("data-id");
                              console.log(id);
                              window.personnelToDelete = id;
                              $("#delConfirmPersonel").modal("show");
                          });

                          actionCell.appendChild(editButton);
                          actionCell.appendChild(deleteButton);

                          row.appendChild(fullNameCell);
                          row.appendChild(departmentCell);
                          row.appendChild(locationCell);
                          row.appendChild(emailCell);
                          row.appendChild(actionCell);

                          personnelTableBody.appendChild(row);
                      }
                  });
              } else {
                  console.error("Failed to fetch personnel:", data.status.description);
              }
          })
          .catch(error => console.error("Error fetching personnel:", error));
  }

  // Function to populate departments table
  function populateDepartments(e="") {
      fetch("libs/php/getAllDepartments.php")
          .then(response => response.json())
          .then(data => {
              if (data.status.code === "200") {
                  let departmentTableBody = document.getElementById("departmentTableBody");
                  departmentTableBody.innerHTML = "";
                  data.data.forEach(department => {
                      let departmentName = department.departmentName ? department.departmentName.toLowerCase() : "";
                      let locationName = department.locationName ? department.locationName.toLowerCase() : "";

                      if (departmentName.includes(e.toLowerCase()) || locationName.includes(e.toLowerCase())) {
                          let row = document.createElement("tr");

                          let departmentCell = document.createElement("td");
                          departmentCell.className = "align-middle text-nowrap";
                          departmentCell.textContent = department.departmentName || "";

                          let locationCell = document.createElement("td");
                          locationCell.className = "align-middle text-nowrap d-none d-md-table-cell";
                          locationCell.textContent = department.locationName || "N/A";

                          let actionCell = document.createElement("td");
                          actionCell.className = "align-middle text-end text-nowrap";

                          let editButton = document.createElement("button");
                          editButton.type = "button";
                          editButton.className = "btn btn-success btn-sm";
                          editButton.setAttribute("data-bs-toggle", "modal");
                          editButton.setAttribute("data-bs-target", "#editDepartmentModal");
                          editButton.setAttribute("data-id", department.id);
                          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
                          editButton.addEventListener("click", function() {
                              let id = this.getAttribute("data-id");
                              document.getElementById("editDepartmentID").value = id;
                          });

                          let deleteButton = document.createElement("button");
                          deleteButton.type = "button";
                          deleteButton.className = "btn btn-success btn-sm deleteDepartmentBtn";
                          deleteButton.setAttribute("data-bs-toggle", "modal");
                          deleteButton.setAttribute("data-bs-target", "#deleteDepartmentModal");
                          deleteButton.setAttribute("data-id", department.id);
                          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
                          deleteButton.addEventListener("click", function() {
                              let id = this.getAttribute("data-id");
                              console.log(id);
                              $("#deleteDepartmentModal").show();
                              $("#delConfirmDepartmentBtn").click(function() {
                                  $.ajax({
                                      url: "libs/php/deleteDepartmentByID.php",
                                      type: "POST",
                                      data: { id: id },
                                      success: function(data) {
                                          if (data.status.code === "200") {
                                              alert("Department deleted successfully.");
                                              populateDepartments();
                                              $("#deleteDepartmentModal").modal("hide");
                                          } else {
                                              alert("Failed to delete the department: " + data.status.description);
                                          }
                                      },
                                      error: function(xhr, textStatus, errorThrown) {
                                          alert("An error occurred: " + textStatus + " " + errorThrown);
                                      }
                                  });
                                  $("#deleteDepartmentModal").hide();
                              });
                          });

                          actionCell.appendChild(editButton);
                          actionCell.appendChild(deleteButton);

                          row.appendChild(departmentCell);
                          row.appendChild(locationCell);
                          row.appendChild(actionCell);

                          departmentTableBody.appendChild(row);
                      }
                  });
              } else {
                  console.error("Failed to fetch departments:", data.status.description);
              }
          })
          .catch(error => console.error("Error fetching departments:", error));
  }

  // Function to populate locations table
  function populateLocations(e="") {
      fetch("libs/php/getAllLocations.php")
          .then(response => response.json())
          .then(data => {
              if (data.status.code === "200") {
                  let locationTableBody = document.getElementById("locationTableBody");
                  locationTableBody.innerHTML = "";
                  data.data.forEach(location => {
                      let locationName = location.name.toLowerCase();

                      if (locationName.includes(e.toLowerCase())) {
                          let row = document.createElement("tr");

                          let locationCell = document.createElement("td");
                          locationCell.className = "align-middle text-nowrap";
                          locationCell.textContent = location.name;

                          let actionCell = document.createElement("td");
                          actionCell.className = "align-middle text-end text-nowrap";

                          let editButton = document.createElement("button");
                          editButton.type = "button";
                          editButton.className = "btn btn-success btn-sm";
                          editButton.setAttribute("data-bs-toggle", "modal");
                          editButton.setAttribute("data-bs-target", "#editLocationModal");
                          editButton.setAttribute("data-id", location.id);
                          editButton.setAttribute("data-name", location.name);
                          editButton.innerHTML = '<i class="fa-solid fa-pencil fa-fw"></i>';
                          editButton.addEventListener("click", function() {
                              let id = this.getAttribute("data-id");
                              let name = this.getAttribute("data-name");
                              document.getElementById("editLocationID").value = id;
                              document.getElementById("editLocationName").value = name;
                          });

                          let deleteButton = document.createElement("button");
                          deleteButton.type = "button";
                          deleteButton.className = "btn btn-success btn-sm deleteLocationBtn";
                          deleteButton.setAttribute("data-bs-toggle", "modal");
                          deleteButton.setAttribute("data-bs-target", "#deleteLocationModal");
                          deleteButton.setAttribute("data-id", location.id);
                          deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-fw"></i>';
                          deleteButton.addEventListener("click", function() {
                              let id = this.getAttribute("data-id");
                              console.log(id);
                              $("#deleteLocationModal").show();
                              $("#delConfirmLocationBtn").click(function() {
                                  $.ajax({
                                      url: "libs/php/deleteLocationByID.php",
                                      type: "POST",
                                      data: { id: id },
                                      success: function(data) {
                                          if (data.status.code === "200") {
                                              alert("Location deleted successfully.");
                                              populateLocations();
                                              $("#deleteLocationModal").hide();
                                          } else {
                                              alert("Failed to delete the location: " + data.status.description);
                                          }
                                      },
                                      error: function(xhr, textStatus, errorThrown) {
                                          alert("An error occurred: " + textStatus + " " + errorThrown);
                                      }
                                  });
                                  $("#deleteLocationModal").hide();
                              });
                          });

                          actionCell.appendChild(editButton);
                          actionCell.appendChild(deleteButton);

                          row.appendChild(locationCell);
                          row.appendChild(actionCell);

                          locationTableBody.appendChild(row);
                      }
                  });
              } else {
                  console.error("Failed to fetch locations:", data.status.description);
              }
          })
          .catch(error => console.error("Error fetching locations:", error));
  }

  // Initial population of tables
  populatePersonnel();
  populateDepartments();
  populateLocations();

  // Search functionality
  $("#searchInp").on("keyup", function() {
      let searchTerm = $(this).val().toLowerCase();
      populatePersonnel(searchTerm);
      populateDepartments(searchTerm);
      populateLocations(searchTerm);
  });

  // Refresh button functionality
  $("#refreshBtn").click(function() {
      if ($("#personnelBtn").hasClass("active")) {
          populatePersonnel();
      } else if ($("#departmentsBtn").hasClass("active")) {
          populateDepartments();
      } else if ($("#locationsBtn").hasClass("active")) {
          populateLocations();
      }
  });

  // Filters functionality
  $("#filterSubmitBtn").click(function() {
      let departmentFilter = $("#filterModalDepartment").val();
      let locationFilter = $("#filterModalLocation").val();

      if (departmentFilter === "") {
          populatePersonnel(locationFilter);
      } else if (locationFilter === "") {
          populatePersonnel(departmentFilter);
      } else {
          populatePersonnel(locationFilter);
          populatePersonnel(departmentFilter);
      }
  });

  // Modal and button event listeners
  $("#addBtn").on("click", function() {
    // Determine which modal to show based on the active button/tab
    let modalSelector = "";
    if ($("#personnelBtn").hasClass("active")) {
        modalSelector = "#insertPersonnelModal";
    } else if ($("#departmentsBtn").hasClass("active")) {
        modalSelector = "#insertDepartmentModal";
    } else if ($("#locationsBtn").hasClass("active")) {
        modalSelector = "#insertLocationModal";
    }

    // Check if modalSelector is defined and valid
    if (modalSelector && $(modalSelector).length) {
        // Ensure modal is initialized as modal
        if (!$(modalSelector).hasClass("modal")) {
            $(modalSelector).modal({ backdrop: "static", keyboard: false });
        }
        // Show the modal
        $(modalSelector).modal("show");
    } else {
        console.error("No active button found or modal not defined.");
    }
});

  // Insert Personnel
  $("#insertPersonnelBtn").click(function() {
      let firstName = $("#insertPersonnelFirstName").val();
      let lastName = $("#insertPersonnelLastName").val();
      let department = $("#insertPersonnelDepartment").val();
      let email = $("#insertPersonnelEmailAddress").val();
      let departmentID = {
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
      }[department] || "Unknown";

      $.ajax({
          url: "libs/php/insertPersonel.php",
          type: "POST",
          data: {
              firstName: firstName,
              lastName: lastName,
              departmentID: departmentID,
              email: email
          },
          dataType: "json",
          success: function(data) {
              if (data.status.code === "200") {
                  alert("Personnel added successfully!");
                  populatePersonnel();
              } else {
                  alert("Error: " + data.status.description);
              }
          },
          error: function(xhr, textStatus, errorThrown) {
              console.error(xhr);
              alert("An error occurred: " + textStatus + " " + errorThrown);
          }
      });
  });

  // Insert Department
  $("#insertDepartmentBtn").click(function() {
      let departmentName = $("#insertDepartmentName").val();
      let locationID = {
          "London": "1",
          "New York": "2",
          "Paris": "3",
          "Munich": "4",
          "Rome": "5"
      }[$("#insertDepartmentLocation").val()] || "Unknown";

      $.ajax({
          url: "libs/php/insertDepartment.php",
          type: "POST",
          data: {
              name: departmentName,
              locationID: locationID
          },
          dataType: "json",
          success: function(data) {
              if (data.status.code === "200") {
                  alert("Department added successfully!");
                  populateDepartments();
              } else {
                  alert("Error: " + data.status.description);
              }
          },
          error: function(xhr, textStatus, errorThrown) {
              console.error(xhr);
              alert("An error occurred: " + textStatus + " " + errorThrown);
          }
      });
  });

  // Insert Location
  $("#insertLocationBtn").click(function() {
      let locationName = $("#insertLocationName").val();

      $.ajax({
          url: "libs/php/insertLocation.php",
          type: "POST",
          data: {
              name: locationName
          },
          dataType: "json",
          success: function(data) {
              if (data.status.code === "200") {
                  alert("Location added successfully!");
                  populateLocations();
              } else {
                  alert("Error: " + data.status.description);
              }
          },
          error: function(xhr, textStatus, errorThrown) {
              console.error(xhr);
              alert("An error occurred: " + textStatus + " " + errorThrown);
          }
      });
  });

  // Edit Department
  $("#editDepartmentConfirm").click(function(e) {
      e.preventDefault();
      let departmentName = $("#editDepartmentDropdown").val();
      let locationName = $("#editDepartmentLocation").val();
      let departmentID = $("#editDepartmentID").val();
      let locationID = {
          "London": "1",
          "New York": "2",
          "Paris": "3",
          "Munich": "4",
          "Rome": "5"
      }[locationName] || "Unknown";

      $.ajax({
          url: "libs/php/editDepartmentByID.php",
          type: "POST",
          data: {
              id: departmentID,
              name: departmentName,
              locationID: locationID
          },
          dataType: "json",
          success: function(data) {
              if (data.status.code === "200") {
                  alert("Department updated successfully!");
                  $("#editDepartmentModal").modal("hide");
                  populateDepartments();
              } else {
                  alert("Error: " + data.status.description);
              }
          },
          error: function(xhr, textStatus, errorThrown) {
              console.error(xhr);
              alert("An error occurred: " + textStatus + " " + errorThrown);
          }
      });
  });

  // Edit Location
  $("#editLocationConfirm").click(function(e) {
      e.preventDefault();
      let locationName = $("#editLocationName").val();
      let locationID = $("#editLocationID").val();

      $.ajax({
          url: "libs/php/editLocationByID.php",
          type: "POST",
          data: {
              id: locationID,
              name: locationName
          },
          dataType: "json",
          success: function(data) {
              if (data.status.code === "200") {
                  alert("Location updated successfully!");
                  $("#editLocationModal").modal("hide");
                  populateLocations();
              } else {
                  alert("Error: " + data.status.description);
              }
          },
          error: function(xhr, textStatus, errorThrown) {
              console.error(xhr);
              alert("An error occurred: " + textStatus + " " + errorThrown);
          }
      });
  });

  // Edit Personnel
  $("#editPersonnelConfirm").click(function(e) {
      e.preventDefault();
      let firstName = $("#editPersonnelFirstName").val();
      let lastName = $("#editPersonnelLastName").val();
      let department = $("#editPersonnelDepartment").val();
      let email = $("#editPersonnelEmailAddress").val();
      let personnelID = $("#editPersonnelEmployeeID").val();
      let departmentID = {
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
      }[department] || "Unknown";

      $.ajax({
          url: "libs/php/editPersonelByID.php",
          type: "POST",
          data: {
              id: personnelID,
              firstName: firstName,
              lastName: lastName,
              departmentID: departmentID,
              email: email
          },
          dataType: "json",
          success: function(data) {
              if (data.status.code === "200") {
                  alert("Personnel updated successfully!");
                  $("#editPersonnelModal").modal("hide");
                  populatePersonnel();
              } else {
                  alert("Error: " + data.status.description);
              }
          },
          error: function(xhr, textStatus, errorThrown) {
              console.error(xhr);
              alert("An error occurred: " + textStatus + " " + errorThrown);
          }
      });
  });

});
