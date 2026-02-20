export const ALL_EMPLOYEES = [
  { id: 1,  name: 'Leslie Alexander',  salaryPerMonth: 500000, paid: false, status: 'Late'       },
  { id: 2,  name: 'Guy Hawkins',        salaryPerMonth: 30000,  paid: false, status: 'Yet to pay' },
  { id: 3,  name: 'Savannah Nguyen',    salaryPerMonth: 68000,  paid: false, status: 'Yet to pay' },
  { id: 4,  name: 'Jenny Wilson',       salaryPerMonth: 40500,  paid: false, status: 'Yet to pay' },
  { id: 5,  name: 'Leasie Watson',      salaryPerMonth: 40000,  paid: true,  status: 'On Time'    },
  { id: 6,  name: 'Jacob Jones',        salaryPerMonth: 50000,  paid: true,  status: 'On Time'    },
  { id: 7,  name: 'Albert Flores',      salaryPerMonth: 11500,  paid: true,  status: 'On Time'    },
  { id: 8,  name: 'Brooklyn Simmons',   salaryPerMonth: 25000,  paid: false, status: 'Yet to pay' },
  { id: 9,  name: 'Cameron Williamson', salaryPerMonth: 55000,  paid: false, status: 'Late'       },
  { id: 10, name: 'Dianne Russell',     salaryPerMonth: 72000,  paid: true,  status: 'On Time'    },
  { id: 11, name: 'Eleanor Pena',       salaryPerMonth: 38000,  paid: false, status: 'Yet to pay' },
  { id: 12, name: 'Floyd Miles',        salaryPerMonth: 44500,  paid: true,  status: 'On Time'    },
];

export const formatRs = (amount) =>
  'Rs. ' + amount.toLocaleString('en-IN');

export const salaryStructureMockData = {
  earnings: [
    { id: 1, name: 'Basic Salary' },
    { id: 2, name: 'House Rent Allowance' },
    { id: 3, name: 'Conveyance Allowance' },
    { id: 4, name: 'Medical Allowance' },
    { id: 5, name: 'Special Allowance' },
  ],
  deductions: [
    { id: 1, name: 'Employee Provident Fund' },
    { id: 2, name: 'ESI / Health Insurance' },
    { id: 3, name: 'Professional Tax' },
  ],
};
