import React, { useState, useEffect } from 'react';

// MUI
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// REDUX
import { useSelector } from 'react-redux';

import ProductAdd from './ProductAdd';

import {
  DeleteForever,
  Edit,
  ToggleOn,
  ToggleOff,
  CheckBox,
  DisabledByDefault,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';

// CammelCase Helper
const camelCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Timestamp to Date
const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Row = (props) => {
  const { product, onAction } = props;
  const [open, setOpen] = useState(false);

  // FILTERS
  const filters = useSelector((state) => state.filters);

  const [showEdit, setShowEdit] = useState(false);
  const handleEdit = () => {
    setShowDelete(false);
    setShowEdit(!showEdit);
  };
  const [showDelete, setShowDelete] = useState(false);
  const handleDelete = () => {
    setShowEdit(false);
    setShowDelete(!showDelete);
  };

  const onActionClicked = (type, product) => {
    console.log('onActionClicked', type, product);
    onAction && onAction({ type, product });
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{product.productName}</TableCell>
        <TableCell align="left">{product.productCost}</TableCell>
        <TableCell align="left">
          <Tooltip
            title={
              product.productStatus.toString().toLowerCase() === 'active'
                ? 'Inactivate'
                : 'Activate'
            }
          >
            <IconButton
              color={
                product.productStatus.toString().toLowerCase() === 'active'
                  ? 'success'
                  : 'error'
              }
              onClick={() => {
                onActionClicked('status', product);
              }}
            >
              {product.productStatus.toString().toLowerCase() === 'active' ? (
                <ToggleOn />
              ) : (
                <ToggleOff />
              )}
            </IconButton>
          </Tooltip>
          {product.productStatus}
        </TableCell>
        <TableCell align="left">
          {formatDate(product.productModified)}
        </TableCell>
        <TableCell align="center">
          <Tooltip title="Delete">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteForever />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={handleEdit}>
              <Edit />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: '#eeeeff',
          }}
          colSpan={6}
        >
          <Collapse in={showEdit} timeout="auto" unmountOnExit>
            <ProductAdd
              filters={filters}
              onEditProduct={() => onActionClicked('edit', product)}
              editedProduct={product}
            />
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: '#ffcccc',
          }}
          colSpan={6}
        >
          <Collapse in={showDelete} timeout="auto" unmountOnExit>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{ margin: 1 }}
            >
              <Typography variant="h7" gutterBottom component="div">
                Delete Product?
              </Typography>
              <Box
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
              >
                <IconButton
                  color="success"
                  onClick={() => onActionClicked('delete', product)}
                >
                  <CheckBox />
                </IconButton>{' '}
                <IconButton color="error" onClick={handleDelete}>
                  <DisabledByDefault />
                </IconButton>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: '#eeffff',
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h7" gutterBottom component="div">
                Product Description
                <Typography
                  gutterBottom
                  component="div"
                  sx={{ color: '#999', fontSize: 14 }}
                >
                  {product.productDesc}
                </Typography>
              </Typography>
              <Typography variant="h7" gutterBottom component="div" mt={3}>
                Product Filters
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#333' }}>
                    {product['filters'].map((filter, index) => (
                      // filter title (type)
                      <TableCell key={index} sx={{ color: 'white' }}>
                        {camelCase(filter.filterType)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ backgroundColor: '#eee' }}>
                    {product['filters'].map((filter, index) => (
                      // filter variant
                      <TableCell key={index}>
                        {camelCase(filter.filterVariant)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="h7" gutterBottom component="div" mt={3}>
                Product Inventory
                <Typography
                  gutterBottom
                  component="div"
                  sx={{ color: '#999', fontSize: 14 }}
                >
                  {/*TODO row with crud*/ product.productInventory}
                </Typography>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ProductTable = (props) => {
  const { data, onProductAction } = props;
  // DATA FORMATING
  const [products, setProduts] = useState([]);
  useEffect(() => {
    /**
     * This process takes the data
     * which is rows of 'Product', contains all the info,
     * and creates a new Data 'Rows'
     * seperates the info into 2 layers:
     * 1) Row data (id, name, etc)
     * 2) Array of all the filters [category, size, +++]
     *
     * this is needed because filters are modular
     * and the Product 'Row' may contain different amount of filters
     */
    //

    let rows = [];

    data.forEach((product) => {
      let info = {};
      let filtersList = [];
      for (const [key, value] of Object.entries(product)) {
        switch (key) {
          // ▼ this is the Info layers
          case 'filters':
            for (const [, filter] of Object.entries(value)) {
              filtersList.push({
                filterType: filter['filterType'],
                filterVariant: filter['filterVariant'],
              });
            }
            break;

          default:
            // ▼ this is the Filter layers
            info[key] = value;
            break;
        }
      }

      // add the filters array as the last item in the info row
      info['filters'] = filtersList.sort((a, b) => (a > b ? 1 : -1));

      // add this info row to 'Rows'
      rows.push(info);
    });

    setProduts(rows);
  }, [data]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // ROW CALLBACK
  const onAction = (props) => {
    onProductAction && onProductAction(props);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#333' }}>
              <TableCell />
              <TableCell align="left" sx={{ color: 'white' }}>
                Name
              </TableCell>
              <TableCell align="left" sx={{ color: 'white' }}>
                Cost
              </TableCell>
              <TableCell align="left" sx={{ color: 'white' }}>
                Statue
              </TableCell>
              <TableCell align="left" sx={{ color: 'white' }}>
                Modified
              </TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => {
                return (
                  <Row key={product.id} product={product} onAction={onAction} />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProductTable;
