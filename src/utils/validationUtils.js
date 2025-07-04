export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateVaccineId = (vaccineId) => {
  return vaccineId && vaccineId.length >= 3;
};

export const validateLotNumber = (lotNumber) => {
  return lotNumber && lotNumber.length >= 3;
};

export const validateQuantity = (quantity) => {
  const num = parseInt(quantity);
  return !isNaN(num) && num >= 0;
};

export const validateExpirationDate = (expirationDate) => {
  const date = new Date(expirationDate);
  const today = new Date();
  return date instanceof Date && !isNaN(date) && date > today;
};

export const validateReceiptForm = (formData) => {
  const errors = {};
  
  if (!validateVaccineId(formData.vaccineId)) {
    errors.vaccineId = 'Vaccine ID is required (minimum 3 characters)';
  }
  
  if (!formData.commercialName) {
    errors.commercialName = 'Commercial name is required';
  }
  
  if (!formData.genericName) {
    errors.genericName = 'Generic name is required';
  }
  
  if (!validateLotNumber(formData.lotNumber)) {
    errors.lotNumber = 'Lot number is required (minimum 3 characters)';
  }
  
  if (!validateExpirationDate(formData.expirationDate)) {
    errors.expirationDate = 'Valid expiration date is required';
  }
  
  if (!validateQuantity(formData.quantityReceived)) {
    errors.quantityReceived = 'Valid quantity received is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};