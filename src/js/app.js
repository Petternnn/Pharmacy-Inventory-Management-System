// Pharmacy Inventory Management OOP

// Base Class: Medicine
class Medicine {
    constructor(name, manufacturer, expirationDate, quantity) {
      // Generate unique ID (could be UUID, or something simpler)
      this.productId = 'MED-' + Date.now(); 
      this.name = name;
      this.manufacturer = manufacturer;
      this.expirationDate = expirationDate; // ISO 8601
      this.quantity = quantity;
    }
  
    // Method in the base class
    getDetails() {
      return `${this.name} by ${this.manufacturer}`;
    }
  }
  
  // Derived Class: PrescriptionMedicine (Inheritance)
  class PrescriptionMedicine extends Medicine {
    constructor(name, manufacturer, expirationDate, quantity, prescriptionRequired) {
      super(name, manufacturer, expirationDate, quantity);
      this.prescriptionRequired = prescriptionRequired;
    }
  
    // Additional method
    isPrescriptionRequired() {
      return this.prescriptionRequired === 'Yes';
    }
  }
  
  // Main Application Class to handle UI & Local Storage
  class PharmacyApp {
    constructor() {
      // For storing all medicine objects
      this.medicines = [];
      // Select form fields
      this.form = document.getElementById('medicine-form');
      this.productName = document.getElementById('productName');
      this.manufacturer = document.getElementById('manufacturer');
      this.expirationDate = document.getElementById('expirationDate');
      this.quantity = document.getElementById('quantity');
      this.prescriptionRequired = document.getElementById('prescriptionRequired');
      this.feedback = document.getElementById('form-feedback');
      // Table body
      this.tableBody = document.getElementById('medicine-table-body');
  
      // Load from localStorage on initialization
      this.loadFromLocalStorage();
  
      // Event listeners
      this.form.addEventListener('submit', (e) => this.addMedicine(e));
    }
  
    // Load data from localStorage
    loadFromLocalStorage() {
      const data = localStorage.getItem('pharmacyData');
      if (data) {
        // Rebuild objects as PrescriptionMedicine for demonstration
        const parsedData = JSON.parse(data).map(med => {
          return new PrescriptionMedicine(
            med.name,
            med.manufacturer,
            med.expirationDate,
            med.quantity,
            med.prescriptionRequired
          );
        });
        this.medicines = parsedData;
        this.renderTable();
      }
    }
  
    // Save data to localStorage
    saveToLocalStorage() {
      localStorage.setItem('pharmacyData', JSON.stringify(this.medicines));
    }
  
    // Add a new Medicine / PrescriptionMedicine
    addMedicine(e) {
      e.preventDefault();
  
      // Simple form validation
      if (!this.productName.value || !this.manufacturer.value 
          || !this.expirationDate.value || !this.quantity.value) {
        this.feedback.textContent = 'Please fill all required fields.';
        return;
      }
  
      // Reset feedback
      this.feedback.textContent = '';
  
      // Create new medicine object
      const newMed = new PrescriptionMedicine(
        this.productName.value,
        this.manufacturer.value,
        this.expirationDate.value,
        parseInt(this.quantity.value, 10),
        this.prescriptionRequired.value
      );
  
      // Add to array
      this.medicines.push(newMed);
  
      // Save to local storage
      this.saveToLocalStorage();
  
      // Re-render the table
      this.renderTable();
  
      // Clear form fields
      this.form.reset();
    }
  
    // Render the table in the UI
    renderTable() {
      // Clear current rows
      this.tableBody.innerHTML = '';
  
      // Populate table
      this.medicines.forEach((med, index) => {
        const row = document.createElement('tr');
  
        // Create cells
        row.innerHTML = `
          <td>${med.productId}</td>
          <td>${med.name}</td>
          <td>${med.manufacturer}</td>
          <td>${med.expirationDate}</td>
          <td>${med.quantity}</td>
          <td>${med.prescriptionRequired}</td>
          <td>
            <button class="actions-button edit-btn" data-index="${index}">Edit</button>
            <button class="actions-button delete-btn" data-index="${index}">Delete</button>
          </td>
        `;
  
        // Append row
        this.tableBody.appendChild(row);
      });
  
      // Attach event listeners for edit and delete
      this.attachRowActions();
    }
  
    // Attach click events to Edit/Delete buttons
    attachRowActions() {
      const editButtons = document.querySelectorAll('.edit-btn');
      const deleteButtons = document.querySelectorAll('.delete-btn');
  
      editButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => this.editMedicine(e));
      });
  
      deleteButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => this.deleteMedicine(e));
      });
    }
  
    // Edit medicine record
    editMedicine(e) {
      const index = e.target.dataset.index;
      const med = this.medicines[index];
  
      // Populate form with existing data
      this.productName.value = med.name;
      this.manufacturer.value = med.manufacturer;
      this.expirationDate.value = med.expirationDate;
      this.quantity.value = med.quantity;
      this.prescriptionRequired.value = med.prescriptionRequired;
  
      // Remove from array so new changes can be re-added
      this.medicines.splice(index, 1);
  
      // Save updated array (temporarily) and re-render
      this.saveToLocalStorage();
      this.renderTable();
    }
  
    // Delete medicine record
    deleteMedicine(e) {
      const index = e.target.dataset.index;
      this.medicines.splice(index, 1);
      this.saveToLocalStorage();
      this.renderTable();
    }
  }
  
  // Instantiate the PharmacyApp once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    new PharmacyApp();
  });
  