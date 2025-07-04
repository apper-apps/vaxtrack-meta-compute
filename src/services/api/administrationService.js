import administrationsData from '@/services/mockData/administrations.json';

let administrations = [...administrationsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const administrationService = {
  async getAll() {
    await delay(300);
    return administrations.map(admin => ({ ...admin }));
  },

  async getById(id) {
    await delay(200);
    const admin = administrations.find(a => a.Id === parseInt(id));
    return admin ? { ...admin } : null;
  },

  async create(adminData) {
    await delay(400);
    const newAdmin = {
      ...adminData,
      Id: Math.max(...administrations.map(a => a.Id)) + 1
    };
    administrations.push(newAdmin);
    return { ...newAdmin };
  },

  async update(id, adminData) {
    await delay(300);
    const index = administrations.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      administrations[index] = { ...administrations[index], ...adminData };
      return { ...administrations[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = administrations.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      administrations.splice(index, 1);
      return true;
    }
    return false;
  },

  async getByVaccineId(vaccineId) {
    await delay(200);
    return administrations.filter(admin => admin.vaccineId === vaccineId);
  },

  async recordAdministration(vaccineId, lotNumber, dosesAdministered) {
    await delay(300);
    const newAdmin = {
      Id: Math.max(...administrations.map(a => a.Id)) + 1,
      vaccineId,
      lotNumber,
      dosesAdministered,
      administrationDate: new Date().toISOString().split('T')[0]
    };
    administrations.push(newAdmin);
    return { ...newAdmin };
  }
};