import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Pagination,
  Typography,
  TextField,
} from '@mui/material';

export default function CustomTablePagination({
  columns,
  fetchDataFunction,
  refresher,
  initialPageSize = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  rowKey = '_id',
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 700);

    return () => clearTimeout(handler);
  }, [search]);

  const loadData = useCallback(async () => {
    try {
      const { data, total } = await fetchDataFunction(
        page,
        rowsPerPage,
        debouncedSearch
      );
      setRows(data);
      setTotalCount(total);
    } catch (error) {
      console.error('Error fetching data:', error);
      setRows([]);
      setTotalCount(0);
    }
  }, [page, rowsPerPage, debouncedSearch, fetchDataFunction]);

  useEffect(() => {
    loadData();
  }, [loadData, refresher]);

  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;

  const handleChangePage = (_, value) => setPage(value);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const getNestedValue = (obj, path) =>
    path
      .split('.')
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
        obj
      );

  const renderCellValue = (column, row) => {
    if (column.render) return column.render(row);
    const value = getNestedValue(row, column.id);
    if (column.format) return column.format(value, row);
    return value ?? '-';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          البحث:
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280, backgroundColor: '#f5f5f5', borderRadius: 1 }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {columns.map(({ id, label, minWidth, align }) => (
                <TableCell
                  key={id}
                  align={align || 'left'}
                  sx={{
                    minWidth,
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 15,
                    fontFamily: 'Almarai',
                    textAlign: 'center',
                    borderBottom: '2px solid #1565c0',
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row[rowKey] || index}
                  sx={{ borderBottom: '1px solid #ddd' }}
                >
                  {columns.map(({ id, align, minWidth }) => (
                    <TableCell
                      key={id}
                      align={align || 'left'}
                      sx={{
                        py: 1.5,
                        fontSize: 16,
                        color: '#333',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxWidth: minWidth,
                        textAlign: 'center',
                        fontFamily: 'Almarai',
                      }}
                      title={renderCellValue(
                        columns.find((c) => c.id === id),
                        row
                      )}
                    >
                      {renderCellValue(
                        columns.find((c) => c.id === id),
                        row
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 3, fontSize: 16 }}
                >
                  لا توجد بيانات للعرض
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="rows-per-page-label">عدد الصفوف</InputLabel>
          <Select
            labelId="rows-per-page-label"
            id="rows-per-page-select"
            value={rowsPerPage}
            label="عدد الصفوف"
            onChange={handleChangeRowsPerPage}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ minWidth: 120, textAlign: 'right' }}
        >
          إجمالي: {totalCount} عنصر
        </Typography>
      </Box>
    </Paper>
  );
}
