This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

<p align='center'>
<img src='https://cdn.jsdelivr.net/gh/marionebl/create-react-app@9f6282671c54f0874afd37a72f6689727b562498/screencast-error.svg' width='600' alt='Build errors'>
</p>

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

[Read more about testing.](https://facebook.github.io/create-react-app/docs/running-tests)

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## User Guide

You can find detailed instructions on using Create React App and many tips in [its documentation](https://facebook.github.io/create-react-app/).

For testing, there are two VendorCodeIds that have multiple PlanLoads and PurchaseOrders so you can start your test with them:

-   208516
    -- (VendorId 6961)
-   24575  
     -- (VendorId 182)

## Step 1

Build a plan load shipping unit (this is my pallet essentially)
Load Name (planes decides)
Dims
Weight
Etc.

-   [ ] planLoadId (via purchase order id)
-   [ ] Packaging (req)
-   [ ] Weight (req)
-   [ ] DIMS (req)
-   [ ] License Plate # (not req)

## Step 2

Add items from the PO details into the plan load shipping unit details table

-   [ ] PlanLoadShippingUnitId
-   [ ] PurchaseOrderDetailID
-   [ ] Item Nbr (this is item ID on the table)
-   [ ] Qty
-   [ ] (ignore HTS code)

## Updates for 9/16

-   [ ] Added Plan load index to PlanLoads, index starting at 1
-   [ ] Changed item ID on PLSU-Details to string instead of int

# Statuses -

-   **New:** Available and no PlanLoadShippingUnits created
-   **In Progress:** At least one PlanLoadShippingUnit created
-   **Ready to Ship Partial:** Part of PO is ready to ship
-   **Ready to Ship In Full** All (or remainder) of PO is ready to Ship
-   **Shipped:** All of PO is shipped
-   **Delivered:** All of PO is delivered

### Emails

-   Send an email to usr for forgot password
-   Send an email to Somewhere for when the shipping unit is ready to ship partial or final

### Plan Load Locations

The only Location they are allowed to create Shipping Units under is VENDOR (LocationID 1636). The Locations you will set them to are:

-   ASN READY - SHIPPED PARTIAL (LocationID 10489)
-   ASN READY - SHIPPED FULL (LocationID 10490)

## Updates for 4/23

-   [x] Sort on Dashboard
-   [x] Sort by due date on table as well
-   [x] Sort ALL Pos by ship date and put "shpped" pos at the end
-   [x] On Delete Shipping Unit
-   [x] Back to PO Details from Quick Ship
-   [x] Use "Quick Ship" and "Detailed Ship" Everywhere
-   [x] default shading under “Measurement” on the Edit Shipping Unit Details
-   [ ] Please note that dimensions are now "IN" and "CM" in the database
-   [x] The SU on the left in Olive did not update when the Load type is changed
-   [x] On the “Add Items” to SU screen, sort by Item #, it currently sorts by PurchaseOrderDetailId sort alphabetically by item # (string)
-   [x] “Add Max” on the Quantity popup screen pops up with a “todo” message on the screen
-   [x] I may be wrong but I thought we had a shipping units “exploded” tab on the “Orders” screen. Was that removed at some point?
-   [ ] Please Note that This is the case for purchase orders where it is marked "ready to ship in full"
