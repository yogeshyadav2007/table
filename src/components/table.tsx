import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { getData, resetData, getDataByFilter, sortData, addInvoice, editInvoice } from '../redux/tableSlice';
import type { AppDispatch, RootState } from '../tableStore/store';
import InvoiceFormModal from "./InvoiceFormModal";;
import { Card, CardHeader, Input, Typography, Button, CardBody, CardFooter, Chip, 
  Tabs, TabsHeader, Tab, IconButton, Tooltip } from "@material-tailwind/react";
import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from 'react-redux';


const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

// Table head
const TABLE_HEAD = [
  "Invoice Number",
  "Smart Property",
  "Smart Property City",
  "Opportunity Name",
  "Opportunity Owner",
  "Total Commission",
  "Days Past Due",
  "Move In Date",
  "Application Date",
  "AR Owner",
  "Accounts Receivable Stage",
  "AR Last Modified Date",
  "",
] as const;

// Table state
type InvoiceTableState = {
  tabValue: string;
  searchValue: string;
  currentPage: number;
  rowsPerPage: number;
  isModalOpen: boolean;
  mode: "add" | "edit";
  selectedInvoice: any | null;
};

// Initial state
const initialState: InvoiceTableState = {
  tabValue: "all",
  searchValue: "",
  currentPage: 1,
  rowsPerPage: 10,
  isModalOpen: false,
  mode: "add",
  selectedInvoice: null,
};

// Action types
type Action =
  | { type: "SET_TAB"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_ROWS_PER_PAGE"; payload: number }
  | { type: "OPEN_ADD_MODAL" }
  | { type: "OPEN_EDIT_MODAL"; payload: any }
  | { type: "CLOSE_MODAL" };

// Reducer
function invoiceTableReducer( state: InvoiceTableState, action: Action ): 
  InvoiceTableState {
    switch (action.type) {
      // Update Tab
      case "SET_TAB":
        return { ...state, tabValue: action.payload, currentPage: 1 };

      // Update Search Bar
      case "SET_SEARCH":
        return { ...state, searchValue: action.payload, currentPage: 1 };

      // Update Page
      case "SET_PAGE":
        return { ...state, currentPage: action.payload };

      // Update Rows Per Page
      case "SET_ROWS_PER_PAGE":
        return { ...state, rowsPerPage: action.payload, currentPage: 1 };

      // Open Add Invoice Form Modal
      case "OPEN_ADD_MODAL":
        return {
          ...state,
          mode: "add",
          selectedInvoice: null,
          isModalOpen: true,
        };

      // Open Edit Invoice Form Modal
      case "OPEN_EDIT_MODAL":
        return {
          ...state,
          mode: "edit",
          selectedInvoice: action.payload,
          isModalOpen: true,
        };

      // Close Invoice Form Modal
      case "CLOSE_MODAL":
        return { ...state, isModalOpen: false };

      default:
        return state;
    }
}

export function InvoiceTable() {
  const dispatch = useDispatch<AppDispatch>();
  const TABLE_ROWS = useSelector((state: RootState) => state.table.data) as any[];
  const [state, dispatchLocal] = useReducer(
    invoiceTableReducer,
    initialState
  );
  const { tabValue, searchValue, currentPage, rowsPerPage, isModalOpen, mode, selectedInvoice } = state;  // Destructure state
  const totalPages = Math.max(1, Math.ceil(TABLE_ROWS.length / rowsPerPage)); // Calculate total pages
  const startIndex = (currentPage - 1) * rowsPerPage; // Calculate start index
  const endIndex = startIndex + rowsPerPage;  // Calculate end index
  const paginatedRows = TABLE_ROWS.slice(startIndex, endIndex); // Get paginated rows

  // Set page to 1 when TABLE_ROWS changes
  useEffect(() => {
    dispatchLocal({ type: "SET_PAGE", payload: 1 });
  }, [TABLE_ROWS]);

  // Set page to 1 when tabValue changes or tabValue is "all" and TABLE_ROWS changes according to tabValue
  useEffect(() => {
    dispatchLocal({ type: "SET_SEARCH", payload: "" });
    dispatchLocal({ type: "SET_PAGE", payload: 1 });

    if (tabValue === "all") {
      dispatch(resetData());
    } else {
      dispatch(getDataByFilter(tabValue));
    }
  }, [tabValue, dispatch]);
  
  // Set page to 1 when searchValue changes or tabValue is "all" and TABLE_ROWS changes according to searchValue
  useEffect(() => {
    if (searchValue !== "") {
      dispatch(getData(searchValue));
    } else if (tabValue === "all") {
      dispatch(resetData());
    }
  }, [searchValue, tabValue, dispatch]);

  // Handle view all button click 
  const handleViewAll = () => {
    dispatch(resetData());
    dispatchLocal({ type: "SET_SEARCH", payload: "" });
    dispatchLocal({ type: "SET_TAB", payload: "all" });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    dispatchLocal({ type: "SET_SEARCH", payload: "" });
    dispatchLocal({ type: "SET_TAB", payload: value });
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchLocal({ type: "SET_SEARCH", payload: e.target.value });
    dispatchLocal({ type: "SET_TAB", payload: "all" });
  };

  // Handle open add invoice modal
  const handleOpenAddModal = () => {
    dispatchLocal({ type: "OPEN_ADD_MODAL" });
  };

  // Handle sort
  const handleSort = (head: string) => {
    dispatch(sortData(head));
  };

  // Handle open edit invoice modal
  const handleOpenEditModal = (row: any) => {
    dispatchLocal({ type: "OPEN_EDIT_MODAL", payload: row });
  };

  // Handle close modal
  const handleCloseModal = () => {
    dispatchLocal({ type: "CLOSE_MODAL" });
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatchLocal({
      type: "SET_ROWS_PER_PAGE",
      payload: Number(e.target.value),
    });
  };

  // Handle page change to previous
  const handlePreviousPage = () => {
    dispatchLocal({ type: "SET_PAGE", payload: currentPage - 1 });
  };

  // Handle page change to next
  const handleNextPage = () => {
    dispatchLocal({ type: "SET_PAGE", payload: currentPage + 1 });
  };

  // Handle submit invoice
  const handleSubmitInvoice = (data: any) => {
    if (mode === "add") {
      dispatch(addInvoice(data));
    } else {
      dispatch(editInvoice(data));
    }
    dispatchLocal({ type: "SET_PAGE", payload: 1 });
    dispatchLocal({ type: "CLOSE_MODAL" });
  };


  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Invoice List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See details for all invoices
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm" onClick={ handleViewAll }>
              {/* Button to view all invoices */}
              View All
            </Button>
            <Button className="flex items-center gap-3" size="sm" onClick={ handleOpenAddModal }>
              {/* Button to add new invoice */}
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Invoice
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs key={tabValue} value={tabValue} >
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => handleTabChange(String(value))}
                >
                  {/* Tabs to filter invoices by status */}
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>

          <div className="w-full md:w-72">
            {/* Search bar */}
            <Input
              label="Search" id="search" value={searchValue}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />} onChange={ handleSearchChange }/>
          </div>
        </div>
      </CardHeader>

      <CardBody className="h-[500px] px-0">
        <div className="h-full overflow-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 bg-blue-gray-50 z-10">
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {/* Table header */}
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        // Sort icon
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" onClick={() => handleSort(head)}/>
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map(
                (row, index) => {
                  const isLast = index === paginatedRows.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Invoice Number"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Smart Property"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Smart Property City"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Opportunity Name"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Opportunity Owner"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Total Commission"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color={row["Days Past Due"] > 0 ? "red" : "green"}
                          className="font-normal"
                        >
                          {row["Days Past Due"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Move In Date"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["Application Date"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["AR Owner"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={row["Accounts Receivable Stage"] ?? "-"}
                          color={row["Accounts Receivable Stage"] === "Completed" ? "green" : "orange"}
                        />
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {row["AR Last Modified Date"] ?? "-"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit Invoice">
                          {/* Edit button */}
                          <IconButton variant="text" onClick={() => { handleOpenEditModal(row) }}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            {/* Pagination info and total rows count */}
            Page {currentPage} of {totalPages} • {TABLE_ROWS.length} total rows
          </Typography>

          <div className="flex items-center gap-2">
            <Typography variant="small">
              {/* Rows per page select menu */}
              Rows per page:
            </Typography>

            <select
              className=" w-20 bg-white bg-100 border rounded-md px-3 py-2 text-blue-gray-700 focus:outline-none focus:ring-1 transition border-blue-gray-200 focus:border-black focus:ring-black"
              value={rowsPerPage}
              onChange={ handleRowsPerPageChange }
            >
              {/* Options for rows per page */}
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === 1}
              onClick={ handlePreviousPage }
            >
              {/* Previous button */}
              Previous
            </Button>

            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={ handleNextPage }
            >
              {/* Next button */}
              Next
            </Button>
          </div>
        </CardFooter>
      <InvoiceFormModal
        open={isModalOpen} mode={mode} initialData={selectedInvoice} onClose={ handleCloseModal }
        onSubmit={ handleSubmitInvoice } existingInvoices={ TABLE_ROWS }/> 
    </Card>
  );
}