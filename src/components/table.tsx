import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { getData, resetData, getDataByFilter, sortData, addInvoice, editInvoice } from '../redux/tableSlice.tsx';
import type { AppDispatch, RootState } from '../tableStore/store.ts';
import InvoiceFormModal from "./InvoiceFormModal.tsx";;
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import AddInvoiceModal from "./InvoiceFormModal.tsx";

const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

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
  "EDIT",
] as const;



export function InvoiceTable() {
  const [tabValue, setTabValue] = useState("all");
  const TABLE_ROWS = useSelector((state: RootState) => state.table.data) as any[];
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const totalPages = Math.ceil(TABLE_ROWS.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = TABLE_ROWS.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [TABLE_ROWS]);
  const dispatch = useDispatch<AppDispatch>();
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
            <Button variant="outlined" size="sm" onClick={() => {dispatch(resetData()); 
            }}>
              View All
            </Button>
            <Button className="flex items-center gap-3" size="sm" onClick={() => { setMode("add");
              setSelectedInvoice(null); setIsModalOpen(true); }}>
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Invoice
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={tabValue} onChange={setTabValue}>
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value} id="tab"
                onClick={() => {setTabValue(value);
                  if (value === "all") {
                    dispatch(resetData())
                  } else {
                    dispatch(getDataByFilter(value));
                  }}}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>

          <div className="w-full md:w-72">
            <Input
              label="Search" id="search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />} onChange={(event) => { event.target.value !== "" ? dispatch(getData(event.target.value)) : dispatch(resetData())}}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-scroll h-[500px] px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
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
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" onClick={() => dispatch(sortData(head))}/>
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
                        <IconButton variant="text" onClick={() => { setMode("edit"); setSelectedInvoice(row); setIsModalOpen(true);}}>
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
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {totalPages} • {TABLE_ROWS.length} total rows
          </Typography>

          <div className="flex items-center gap-2">
            <Typography variant="small">Rows per page:</Typography>

            <select
              className="border rounded p-1"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
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
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outlined"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      <InvoiceFormModal
        open={isModalOpen} mode={mode} initialData={selectedInvoice} onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {

          if (mode === "add") {
            dispatch(addInvoice(data));
          } else {
            dispatch(editInvoice(data));
          }
          setCurrentPage(1);
          setIsModalOpen(false);
        }}
      /> 
    </Card>
  );
}