import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import BASE_URL from '../Services/Base_Url';
import { useNavigate } from 'react-router';

function createData(id, sale_id, unit_total, discount, tax, currency, total) {
  return { id, sale_id, unit_total, discount, tax, currency, total };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
  { id: 'sale_id', numeric: true, disablePadding: false, label: 'Sale ID' },
  { id: 'unit_total', numeric: true, disablePadding: false, label: 'Unit Total' },
  { id: 'discount', numeric: true, disablePadding: false, label: 'Discount(%)' },
  { id: 'tax', numeric: true, disablePadding: false, label: 'Tax' },
  { id: 'currency', numeric: true, disablePadding: false, label: 'Currency' },
  { id: 'total', numeric: true, disablePadding: false, label: 'Total' },
];

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all rows' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ numSelected, accountId, IdSelected ,handleDeleted ,handleDetail}) {
  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Receipts
        </Typography>
      )}
      {numSelected == 1?
        (<Tooltip title="Detail Receipt">
          <button onClick={()=>handleDetail(IdSelected)} className='bg-green-600 text-white rounded-sm mr-10 cursor-pointer'><pre className='p-2'>Detail receipt</pre></button>
        </Tooltip>): ""
      }
      {accountId==1?numSelected > 0 ? (
        <Tooltip onClick={()=>handleDeleted(IdSelected)} title="Delete">
          <IconButton><DeleteIcon /></IconButton>
        </Tooltip>
      ) :"":""
        // (
        // <Tooltip title="Filter list">
        //   <IconButton><FilterListIcon /></IconButton>
        // </Tooltip>
        // )
      }
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  accountId: PropTypes.number.isRequired,
  IdSelected: PropTypes.number.isRequired,
  handleDeleted: PropTypes.func.isRequired,
  handleDetail: PropTypes.func.isRequired,
};

export default function EnhancedTable() {
  const navigator = useNavigate();
  const accountId = localStorage.getItem("accountId");
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('sale_id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    async function fetchReceipt() {
      try {
        const response = await axios.get(BASE_URL + "/receipts");
        const data = response.data.data || [];
        const formatted = data.map((item, index) =>
          createData(item.id, item.sale_id, item.unit_total, item.discount, item.tax, item.currency, item.total)
        );
        setRows(formatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchReceipt();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? rows.map((n) => n.id) : []);
  };

  const handleDelete = async (IdSelected) => {
    try {
      const response = await axios.delete(BASE_URL + `/receipts/${IdSelected.join(",")}`)
      if (response.data.status == 200) {
        let newRow = rows;
        IdSelected?.forEach((rec) => {
          newRow = newRow.filter((item) => item.id != rec);
        })
        setRows(newRow);
        setSelected([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = selectedIndex === -1
      ? [...selected, id]
      : [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDetail = (IdSelected) => {
    window.open(accountId==1?"/admin/receipt-detail/" + IdSelected[0]: "/staff/receipt-detail/" + IdSelected[0], '_blank');
  }

  const handleChangeDense = (event) => setDense(event.target.checked);

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - rows.length);

  const visibleRows = React.useMemo(() =>
    rows.slice().sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );
  const isSelected = (id) => selected.includes(id);
//h-[calc(100vh-100px)]
  return (
    <Box className="h-[calc(100vh-100px)]">
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} accountId={accountId} IdSelected={selected} handleDeleted={handleDelete} handleDetail={handleDetail}/>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">{index+1}</TableCell>
                    <TableCell align="right">{row.sale_id}</TableCell>
                    <TableCell align="right">{row.unit_total}</TableCell>
                    <TableCell align="right">{row.discount}</TableCell>
                    <TableCell align="right">{row.tax}</TableCell>
                    <TableCell align="right">{row.currency}</TableCell>
                    <TableCell align="right">{row.total}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
    </Box>
  );
}
