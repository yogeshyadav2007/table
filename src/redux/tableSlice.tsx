import { createSlice } from '@reduxjs/toolkit';


const TABLE_ROWS = [
    { "Invoice Number": "INV-001", "Smart Property": "Sunset Villas", "Smart Property City": "Los Angeles", 
      "Opportunity Name": "John Doe", "Opportunity Owner": "Alice Smith", "Total Commission": 1200, 
      "Days Past Due": 5, "Move In Date": "2024-01-15", "Application Date": "2023-12-20",
        "AR Owner": "Bob Johnson", "Accounts Receivable Stage": "Pending", "AR Last Modified Date": "2024-02-01" 
    },
    { "Invoice Number": "INV-002", "Smart Property": "Oceanview Apartments", "Smart Property City": "Miami",
        "Opportunity Name": "Jane Smith", "Opportunity Owner": "David Lee", "Total Commission": 950,
        "Days Past Due": 0, "Move In Date": "2024-02-10", "Application Date": "2024-01-15",
        "AR Owner": "Carol White", "Accounts Receivable Stage": "Completed", "AR Last Modified Date": "2024-02-05"
    },
    { "Invoice Number": "INV-003", "Smart Property": "Mountainview Condos", "Smart Property City": "Denver",
        "Opportunity Name": "Mike Johnson", "Opportunity Owner": "Eve Davis", "Total Commission": 1500,
        "Days Past Due": 10, "Move In Date": "2024-03-01", "Application Date": "2024-01-30",
        "AR Owner": "Frank Brown", "Accounts Receivable Stage": "Pending", "AR Last Modified Date": "2024-02-10"
    },
    { "Invoice Number": "INV-004", "Smart Property": "Lakeside Residences", "Smart Property City": "Chicago",
        "Opportunity Name": "Sara Wilson", "Opportunity Owner": "George Miller", "Total Commission": 1100,
        "Days Past Due": 2, "Move In Date": "2024-02-20", "Application Date": "2024-01-25",
        "AR Owner": "Hannah Garcia", "Accounts Receivable Stage": "Pending", "AR Last Modified Date": "2024-02-08"
    },
    { "Invoice Number": "INV-005", "Smart Property": "Cityview Lofts", "Smart Property City": "New York",
        "Opportunity Name": "Tom Brown", "Opportunity Owner": "Ivy Martinez", "Total Commission": 1300,
        "Days Past Due": 0, "Move In Date": "2024-03-15", "Application Date": "2024-02-10",
        "AR Owner": "Jack Wilson", "Accounts Receivable Stage": "Completed", "AR Last Modified Date": "2024-02-12"
    },
    {
        "Invoice Number": "INV-006", "Smart Property": "Riverside Apartments", "Smart Property City": "Seattle",
        "Opportunity Name": "Emily Davis", "Opportunity Owner": "Karen Lee", "Total Commission": 1250,
        "Days Past Due": 7, "Move In Date": "2024-02-28", "Application Date": "2024-01-20",
        "AR Owner": "Leo Thompson", "Accounts Receivable Stage": "Pending", "AR Last Modified Date": "2024-02-15"
    },
    {
        "Invoice Number": "INV-007", "Smart Property": "Gardenview Villas", "Smart Property City": "Austin",
        "Opportunity Name": "David Wilson", "Opportunity Owner": "Mia Anderson", "Total Commission": 1400,
        "Days Past Due": 3, "Move In Date": "2024-03-05", "Application Date": "2024-01-30",
        "AR Owner": "Sophia Martinez", "Accounts Receivable Stage": "Completed", "AR Last Modified Date": "2024-02-20"
    },
    {
        "Invoice Number": "INV-008", "Smart Property": "Lakeview Condos", "Smart Property City": "San Francisco",
        "Opportunity Name": "Michael Johnson", "Opportunity Owner": "Emily Davis", "Total Commission": 1500,
        "Days Past Due": 0, "Move In Date": "2024-03-10", "Application Date": "2024-02-15",
        "AR Owner": "David Lee", "Accounts Receivable Stage": "Completed", "AR Last Modified Date": "2024-02-25"
    },
    {
        "Invoice Number": "INV-009", "Smart Property": "Cityscape Apartments", "Smart Property City": "Boston",
        "Opportunity Name": "Sophia Thompson", "Opportunity Owner": "John Smith", "Total Commission": 1200,
        "Days Past Due": 5, "Move In Date": "2024-03-15", "Application Date": "2024-02-20",
        "AR Owner": "Emily Davis", "Accounts Receivable Stage": "Pending", "AR Last Modified Date": "2024-02-28"
    },
    { "Invoice Number": "INV-010", "Smart Property": "Harborview Residences", "Smart Property City": "San Diego",
        "Opportunity Name": "James Brown", "Opportunity Owner": "Sarah Wilson", "Total Commission": 1350,
        "Days Past Due": 2, "Move In Date": "2024-03-20", "Application Date": "2024-02-25",
        "AR Owner": "Michael Johnson", "Accounts Receivable Stage": "Pending", "AR Last Modified Date": "2024-03-01"
    },
    {
        "Invoice Number": "INV-011", "Smart Property": "Riverside Apartments", "Smart Property City": "San Francisco",
        "Opportunity Name": "Emily Davis", "Opportunity Owner": "Karen Lee", "Total Commission": 1250,
        "Days Past Due": 7, "Move In Date": "2024-02-28", "Application Date": "2024-01-20",
        "AR Owner": "Leo Thompson", "Accounts Receivable Stage": "Pending", "AR Last Modified Date": "2024-02-15"
    },
    {
        "Invoice Number": "INV-012", "Smart Property": "Lakeview Condos", "Smart Property City": "San Francisco",
        "Opportunity Name": "Michael Johnson", "Opportunity Owner": "Emily Davis", "Total Commission": 1500,
        "Days Past Due": 0, "Move In Date": "2024-03-10", "Application Date": "2024-02-15",
        "AR Owner": "David Lee", "Accounts Receivable Stage": "Completed", "AR Last Modified Date": "2024-02-25"
    }
];

const initialState: { data: any[]; dataBackup: any[] } = {
    data: [...TABLE_ROWS],
    dataBackup: [...TABLE_ROWS],
};

const tableSlice = createSlice({
    name: 'Table',
    initialState,
    reducers: {
        getData(state, action) {
            const searchTerm = action.payload.toLowerCase();
            const filteredData = state.dataBackup.filter(row => {
                return row["Invoice Number"].toLowerCase().includes(searchTerm);
            });
            state.data = filteredData;
            },

        getDataByFilter(state, action) {
            const filterTerm = action.payload.toLowerCase();
            const filteredData = state.dataBackup.filter(row => {
                return row["Accounts Receivable Stage"].toLowerCase() === filterTerm;
            });
            state.data = filteredData;
        },    

        sortData(state, action) {
            const prevData = [...state.data];
            const column = action.payload;
            state.data.sort((a, b) => {
                if (a[column] < b[column]) return -1;
                if (a[column] > b[column]) return 1;
                return 0;
            });
            if (state.data[0][column] === prevData[0][column]) {
                state.data.reverse();
            }
        },
        
        resetData(state) {
            state.data = [...state.dataBackup];
        },

        addInvoice(state, action) {
        state.data.push(action.payload);

        if (!state.dataBackup.find(row => row["Invoice Number"] === action.payload["Invoice Number"])) {
            state.dataBackup.push(action.payload);
        }

        editInvoice(state, action) {
            const update = (TABLE_ROWS: any[]) => {
                const index = TABLE_ROWS.findIndex((
                    row: { [x: string]: any; }) => row["Invoice Number"] === action.payload["Invoice Number"]
                    );
                    if (index !== -1) {
                    TABLE_ROWS[index] = action.payload;
                    }
                };
            update(state.data);
            update(TABLE_ROWS);
            }
    },
});

export const { getData, resetData, getDataByFilter, sortData, addInvoice, editInvoice } = tableSlice.actions;
export default tableSlice.reducer;