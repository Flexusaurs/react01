import React, { useState, useEffect, useReducer, useCallback } from 'react';

// MUI
import { Box, Grid, Button, Alert } from '@mui/material';

// COMPONENTS
import Input from './Input';
import Selector from './Selector';

// CammelCase Helper
const camelCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

//REDUCER
const FORM_UPDATE = 'FORM_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    let formState = state;

    let id = action.id;
    let value = action.value;

    if (id.toString().includes('filter')) {
      // the filter Type
      let type = id.toString().replace('filter', '');

      // remove existing filter of the same Type
      let filters = formState['filters'].filter(
        (item) => item.filterType !== type
      );

      // add this new filter to the Filters Array
      filters.push({
        filterType: type,
        filterVariant: value,
      });

      // set to the formState
      formState['filters'] = filters;
      console.log(filters);
    } else {
      formState[id] = value;
    }

    switch (id) {
      case 'productCost':
      case 'productInventory':
        if (!value || value === '') {
          formState[id] = id === 'productInventory' ? 1 : 0;
        }
        break;
      default:
        break;
    }

    // CHECK IF THE FROM IS VALID
    let formIsValid = Object.keys(formState).reduce((prev, key) => {
      let res;
      if (key === 'productCost' || key === 'productInventory') {
        res = formState[key] > 0;
      } else {
        res = formState[key] !== '';
      }

      return res && prev;
    }, true);

    return {
      ...formState,
      formIsValid: formIsValid,
    };
  }

  return state;
};

// COMPONENT
const ProductAdd = (props) => {
  const { filters, onCreateProduct, onEditProduct, editedProduct, alert } =
    props;

  //REDUCER ACTION / UPDATE
  const [formState, dispatchFormState] = useReducer(formReducer, {
    productName: editedProduct ? editedProduct.productName : '',
    productDesc: editedProduct ? editedProduct.productDesc : '',
    productCost: editedProduct ? editedProduct.productCost : 0,
    productInventory: editedProduct ? editedProduct.productInventory : 1,
    productStatus: editedProduct ? editedProduct.productStatus : 'active',
    filters: editedProduct ? editedProduct.filters : [],
    formIsValid: false,
  });

  // ALERT 
  const [showAlert, setShowAlert] = useState(null);
  useEffect(() => {
    setShowAlert(alert);
  }, [alert]);

  //UPADTE INPUTS
  const onInputUpdate = useCallback(
    (id, value) => {
      dispatchFormState({
        type: FORM_UPDATE,
        id,
        value,
        editedProduct,
      });
      setShowAlert(null);
    },
    [dispatchFormState, setShowAlert]
  );

  //INPUTS CALLBACK
  const onInputChange = (event) => {
    let id = event.target.id;
    let value = event.target.value;

    id && onInputUpdate(id, value);
  };

  // SUBMIT HANDLER
  const onSubmitClicked = () => {
    // if -> just in case...
    // it is validated in the renderer scope
    if (formState.formIsValid) {
      let product = formState;
      delete product.formIsValid;

      // parent callback
      onCreateProduct && onCreateProduct(product);
      onEditProduct && onEditProduct(product);
    }
  };

  return (
    <Box
      sx={{ flexGrow: 1, padding: '50px 0' }}
      display={'flex'}
      justifyContent={'center'}
      background-color={'white'}
    >
      <Grid
        container
        sx={{ width: 1 / 2 }}
        flexDirection={'column'}
        justifyContent={'flex-start'}
        alignItems={'center'}
        background={'#FFFF'}
      >
        <Grid item sx={{ width: 2 }}>
          Create new Product
        </Grid>
        <Grid
          item
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
          sx={{ width: 1 }}
        >
          <Grid item sx={{ width: 1 }} padding={2}>
            <Input
            color={'#EEFF'}
            className={'input'}
              inputType={'text'}
              id={'productName'}
              defaultValue={formState.productName}
              label="Product Name"
              onChange={onInputChange}
              required
              camelCased
              background-color= {'white'}
            />
          </Grid>
          <Grid item sx={{ width: 1 }} padding={2}>
            <Input
              className={'input'}
              inputType={'text'}
              id={'productDesc'}
              defaultValue={formState.productDesc}
              label="Product Description"
              onChange={onInputChange}
              required
              camelCased
            />
          </Grid>
          <Grid item sx={{ width: 1 }}>
            Product Filters
          </Grid>
          {filters.filterTypes.map((type, index) => {
            const variants = filters.filterList
              .filter((item) => item.type === type)
              .map((item) => item.variant);

            return (
              <Grid key={index} item sx={{ width: 2 }} padding={4}>
                <Selector
                className={'input'}
                  id={`filter${camelCase(type)}`}
                  selectors={variants}
                  defaultValue={
                    formState.filters.find(
                      (filter) => filter.filterType === `${camelCase(type)}`
                    )?.filterVariant
                  }
                  label={`${camelCase(type)}`}
                  onSelect={onInputChange}
                  required
                />
              </Grid>
            );
          })}
          <Grid item sx={{ width: 1, color: 'warning' }}>
            Product Inventory
          </Grid>
          <Grid item sx={{ width: 1 }} padding={2}>
            <Input
            backgroundColor={'#EEFF'}
            className={'input'}
              inputType={'currency'}
              id={'productCost'}
              defaultValue={formState.productCost}
              label="Product Cost"
              onChange={onInputChange}
              required
            />
          </Grid>
          <Grid item sx={{ width: 1 }} padding={2}>
            <Input
            className={'input'}
            backgroundColor={'#EEFF'}
              inputType={'number'}
              id={'productInventory'}
              defaultValue={formState.productInventory}
              label="Product Inventory"
              defaultValue={'1'}
              onChange={onInputChange}
              required
            />
          </Grid>
          <Grid item sx={{ width: 2 }} padding={4}>
            <Selector
              id={'productStatus'}
              selectors={['Inactive', 'Active']}
              defaultIndex={1}
              label={'Product Status'}
              onSelect={onInputChange}
              required
            />
          </Grid>
          <Grid item sx={{ width: 2 }} padding={4}>
            <Button
              sx={{ width: 2 }}
              variant="contained"
              color="success"
              onClick={onSubmitClicked}
              disabled={!formState.formIsValid}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        {showAlert && formState.formIsValid && (
          <Grid item sx={{ width: 2 }}>
            <Alert severity={showAlert.type} color={showAlert.type}>
              {showAlert.message}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProductAdd;
