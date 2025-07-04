import vaccinesData from '@/services/mockData/vaccines.json';

let vaccines = [...vaccinesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const vaccineService = {
  async getAll() {
    await delay(300);
    return vaccines.map(vaccine => ({ ...vaccine }));
  },

  async getById(id) {
    await delay(200);
    const vaccine = vaccines.find(v => v.Id === parseInt(id));
    return vaccine ? { ...vaccine } : null;
  },

  async create(vaccineData) {
    await delay(400);
    const newVaccine = {
      ...vaccineData,
      Id: Math.max(...vaccines.map(v => v.Id)) + 1
    };
    vaccines.push(newVaccine);
    return { ...newVaccine };
  },

  async update(id, vaccineData) {
    await delay(300);
    const index = vaccines.findIndex(v => v.Id === parseInt(id));
    if (index !== -1) {
      vaccines[index] = { ...vaccines[index], ...vaccineData };
      return { ...vaccines[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = vaccines.findIndex(v => v.Id === parseInt(id));
    if (index !== -1) {
      vaccines.splice(index, 1);
      return true;
    }
    return false;
  },

  async updateQuantityOnHand(id, newQuantity) {
    await delay(200);
    const index = vaccines.findIndex(v => v.Id === parseInt(id));
    if (index !== -1) {
      vaccines[index].quantityOnHand = newQuantity;
      return { ...vaccines[index] };
    }
    return null;
  },

  async getExpiringVaccines(daysThreshold = 30) {
    await delay(200);
    const currentDate = new Date();
    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(currentDate.getDate() + daysThreshold);
    
    return vaccines.filter(vaccine => {
      const expirationDate = new Date(vaccine.expirationDate);
      return expirationDate <= thresholdDate && expirationDate > currentDate;
    });
  },

  async getExpiredVaccines() {
    await delay(200);
    const currentDate = new Date();
    return vaccines.filter(vaccine => {
      const expirationDate = new Date(vaccine.expirationDate);
      return expirationDate <= currentDate;
    });
  },

  async getLowStockVaccines(threshold = 5) {
    await delay(200);
    return vaccines.filter(vaccine => vaccine.quantityOnHand > 0 && vaccine.quantityOnHand <= threshold);
  }
};