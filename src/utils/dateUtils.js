import { format, differenceInDays, isAfter, isBefore } from 'date-fns';

export const formatDate = (date, formatString = 'MM/dd/yyyy') => {
  return format(new Date(date), formatString);
};

export const getDaysUntilExpiration = (expirationDate) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  return differenceInDays(expDate, today);
};

export const isExpired = (expirationDate) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  return isBefore(expDate, today);
};

export const isExpiringSoon = (expirationDate, thresholdDays = 30) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const thresholdDate = new Date(today);
  thresholdDate.setDate(today.getDate() + thresholdDays);
  
  return isAfter(expDate, today) && isBefore(expDate, thresholdDate);
};

export const getVaccineStatus = (vaccine, lowStockThreshold = 5) => {
  const { expirationDate, quantityOnHand } = vaccine;
  
  if (isExpired(expirationDate)) {
    return { status: 'expired', priority: 1 };
  }
  
  if (isExpiringSoon(expirationDate)) {
    return { status: 'expiring', priority: 2 };
  }
  
  if (quantityOnHand > 0 && quantityOnHand <= lowStockThreshold) {
    return { status: 'lowStock', priority: 3 };
  }
  
  return { status: 'normal', priority: 4 };
};