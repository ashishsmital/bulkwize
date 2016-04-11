<div class="panel panel-default">
    <div class="panel-heading center-block" >
        <h1 class="panel-title center-block"><img src='http://localhost:63342/bulkwize/MobileFiles/www/img/home.png'/></h1>
    </div>
    <div class="panel-body">
        <div class="row">
            <div class="col-xs-6">
                <strong>From</strong>
                <div>FROM_NAME</div>
                <div>FROM_STREET</div>
                <div>FROM_CITY</div>
                <div>FROM_COUNTY</div>
                <div>FROM_POST_CODE</div>
                <div>FROM_COUNTRY</div>
            </div>
            <div class="col-xs-6">
                <strong>Client</strong>
                <div>CLIENT_NAME</div>
                <div>CLIENT_STREET</div>
                <div>CLIENT_CITY</div>
                <div>CLIENT_COUNTY</div>
                <div>CLIENT_POST_CODE</div>
                <div>CLIENT_COUNTRY</div>
            </div>
        </div>
        <br />
        <div class="row">
        <div class="col-xs-6">
            <strong>Invoice Number:</strong>
            <div>INVOICE_NUMBER</div>
        </div>
        <div class="col-xs-6">
             <strong>Order Number:</strong>
             <div >ORDER_NUMBER</div>
         </div>
        </div>
        <div class="row">
            <div class="col-xs-3"><strong>Order Date:</strong></div>
            <div class="col-xs-9">ORDERDATE</div>
        </div>
        <div class="row">
            <div class="col-xs-3"><strong>Invoice Date:</strong></div>
            <div class="col-xs-9">INVOICEDATE</div>
        </div>
        <br />
        <table class="table">
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Count In Case</th>
                <th>Rate</th>
                <th>Vat</th>
                <th>Amount</th>
            </tr>
            ITEM_LIST
        </table>
        <br />
        <div class="row">
            <div class="col-xs-9"><strong class="pull-right">Subtotal:</strong></div>
            <div class="col-xs-3">SUBTOTAL</div>
            <div class="col-xs-9"><strong class="pull-right">Tax:</strong></div>
            <div class="col-xs-3">TAX</div>
            <div class="col-xs-9"><strong class="pull-right">Shipping:</strong></div>
            <div class="col-xs-3">SHIPPING</div>
            <div class="col-xs-9"><strong class="pull-right">Amount Paid:</strong></div>
            <div class="col-xs-3">PAID</div>
            <div class="col-xs-9"><strong class="pull-right">Balance:</strong></div>
            <div class="col-xs-3">BALANCE</div>
        </div>
    </div>
</div>

