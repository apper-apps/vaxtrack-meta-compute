import receiptsData from '@/services/mockData/receipts.json';

let receipts = [...receiptsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const receiptService = {
  async getAll() {
    await delay(300);
    return receipts.map(receipt => ({ ...receipt }));
  },

  async getById(id) {
    await delay(200);
    const receipt = receipts.find(r => r.Id === parseInt(id));
    return receipt ? { ...receipt } : null;
  },

  async create(receiptData) {
    await delay(400);
    const newReceipt = {
      ...receiptData,
      Id: Math.max(...receipts.map(r => r.Id)) + 1
    };
    receipts.push(newReceipt);
    return { ...newReceipt };
  },

  async update(id, receiptData) {
    await delay(300);
    const index = receipts.findIndex(r => r.Id === parseInt(id));
    if (index !== -1) {
      receipts[index] = { ...receipts[index], ...receiptData };
      return { ...receipts[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = receipts.findIndex(r => r.Id === parseInt(id));
    if (index !== -1) {
      receipts.splice(index, 1);
      return true;
    }
    return false;
  },

  async getByVaccineId(vaccineId) {
    await delay(200);
    return receipts.filter(receipt => receipt.vaccineId === vaccineId);
  }
};