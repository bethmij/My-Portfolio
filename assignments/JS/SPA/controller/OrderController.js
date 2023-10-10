import {customer} from "../model/Customer.js";
import {order} from "../model/Order.js";
// import {orderDetails} from "../model/OrderDetail.js";
import {customerDetail, itemDetail, orders, orderDetail} from "../db/DB.js";
import {item} from "../model/Item.js";
let selectCusOp = $('#cusID');
let selectItemOp = $('#itemCode');
let btnSave = $('#btnAddCart');
let txtItemName = $('#itemName');
let txtItemPrice = $('#itemPrice');
let txtItemQty = $('#itemQuantity');
let txtOrderQty = $('#orderQuantity');
let totalTxt = $('#total-text').text().split("Total : ");
let subTotalTxt = $('#subTotal-text');
let total = totalTxt[1].split(".");
let total1 = parseInt(total[0]);
let cash = $('#cash');
let discount = $('#discount');
let btnOrder = $('#btnPlaceOrder');


setCusID();
setOrderID();
setItemCode();

for (let i = 0; i < customerDetail.length; i++) {
    console.log(customerDetail[i].id);
}

export function setCusID() {
    selectCusOp.empty();
    selectCusOp.append(`<option class="text-white">Customer ID</option>`);

    for (let i = 0; i < customerDetail.length; i++) {
        selectCusOp.append(`<option class="text-white">${customerDetail[i].id}</option>`);
    }
}

function setOrderID() {
    let id = order.oid;
    let orderID = $('#orderID');

    if(id==""){
        orderID.val(`Order ID : OR00-1`);
    }else {
        let num = iddd.split("OR00-");
        let nextID = parseInt(num[1])+1;
        orderID.val(`Order ID : OR00-${nextID}`);
    }
}

selectCusOp.change(function () {
    let cusID = selectCusOp.val();
    for (let i = 0; i < customerDetail.length; i++) {
        if (customerDetail[i].id == cusID) {
            $('#cusName').val(`Customer Name : ${customerDetail[i].name}`);
            $('#cusAddress').val(`Customer Address : ${customerDetail[i].address}`);
            $('#cusSalary').val(`Customer Salary : ${customerDetail[i].salary}`);
        }else if(cusID == "Customer ID" ){
            $('#cusName').val(`Customer Name : `);
            $('#cusAddress').val(`Customer Address : `);
            $('#cusSalary').val(`Customer Salary : `);
            btnSave.attr("disabled", true);
        }
    }
})

export function setItemCode() {
    selectItemOp.empty();
    selectItemOp.append(`<option class="text-white">Item Code</option>`);

    for (let i = 0; i < itemDetail.length; i++) {
        selectItemOp.append(`<option class="text-white">${itemDetail[i].code}</option>`);
    }
}

selectItemOp.change(function () {
    let itemCode = selectItemOp.val();
    for (let i = 0; i < itemDetail.length; i++) {
        if (itemDetail[i].code == itemCode) {
            txtItemName.val(`Item Name : ${itemDetail[i].name}`);
            txtItemPrice.val(`Item Price : ${itemDetail[i].price}`);
            txtItemQty.val(`Item Quantity : ${itemDetail[i].quantity}`);
        }else if(itemCode == "Item Code" ){
            txtItemName.val(`Item Name : `);
            txtItemPrice.val(`Item Price : `);
            txtItemQty.val(`Item Quantity : `);
            btnSave.attr("disabled", true);
        }
    }
})



btnSave.click(function (){
    let itemQty = txtItemQty.val().split("Item Quantity : ");
    let tableCode = $('#orderTbody').children('tr').children(':first-child').text();

    if(parseInt(itemQty[1]) >= parseInt(txtOrderQty.val())) {
        if(tableCode.indexOf(selectItemOp.val())== -1){
            let itemName = txtItemName.val().split("Item Name : ");
            let itemPrice = txtItemPrice.val().split("Item Price : ");

            $('#orderTbody').append(
                `<tr style="height: 2vw">
             <th scope="row">${selectItemOp.val()}</th>
             <td>${itemName[1]}</td>
             <td>${itemPrice[1]}</td>
             <td>${txtOrderQty.val()}</td>
             <td style="width: 10%"><img class="orderDelete" src="../../CSS_Framework/POS/assets/icons8-delete-96.png" alt="Logo" width="50%" className="opacity-75"></td>
        </tr>`
            );
            deleteDetail();
            calcTotal(itemPrice[1], txtOrderQty.val());
        }else {
            alert("duplicate item!");
        }
    }else {
        alert("Stock unavailable!");
    }

})

deleteDetail();

function deleteDetail() {
    let btnDelete = $('.orderDelete');
    btnDelete.on("mouseover", function (){
        $(this).css("cursor", "pointer")}
    )

    btnDelete.click(function () {
        var userChoice = window.confirm("Do you want to delete the item?");

        if (userChoice) {
            $(this).parents('tr').remove();
        }
    })
}

function calcTotal(price, qty) {
    let tot = price*qty;
    total1 += tot;
    $('#total-text').text(`Total : ${total1.toFixed(2)}`);
    $('#subTotal-text').text(`Sub Total : ${total1}`);
}

cash.change(function (){
    let balance = (parseInt( cash.val()) - total1).toFixed(2);
    $('#balance').val(`Balance : ${balance}`);
})

cash.keyup(function (){
    let balance = (parseInt( cash.val()) - total1).toFixed(2);
    $('#balance').val(`Balance : ${balance}`);
    if(cash.val()==""){
        $('#balance').val(`Balance : 0.00`);
    }
})

discount.change(function (){
    let dis = total1 - ((total1*parseInt(discount.val()))/100).toFixed(2);
    $('#subTotal-text').text(`Sub Total : ${dis}`);
})

discount.keyup(function (){
    let dis = total1 - ((total1*parseInt(discount.val()))/100).toFixed(2);
    $('#subTotal-text').text(`Sub Total : ${dis}`);
    if(discount.val()==""){
        $('#subTotal-text').text(`Sub Total : 0.00`);
    }
})

btnOrder.click(function (){
    let oID = $('#orderID').val().split("Order ID : ");
    let orderID = oID[1];
    let currDate = $('#currDate').text().split("Date : ");
    // let itemPrice = txtItemPrice.val().split("Item Price : ");

    if(cash.val()!=""){
        if(!(parseInt(cash.val())<total1)){
            let tableCode = $('#orderTbody').children('tr').children(':nth-child(1)');
            let tablePrice = $('#orderTbody').children('tr').children(':nth-child(3)');
            let tableQty = $('#orderTbody').children('tr').children(':nth-child(4)');
            let newOrderDetails = Object.assign({}, orderDetails);
            for (let i =1; i <=2; i++) {

                newOrderDetails = {
                    oid: orderID,
                    code: $(tableCode[i]).text(),
                    unitPrice: parseInt($(tablePrice[i]).text()),
                    qty: parseInt($(tableQty[i]).text())
                }
                console.log(i);
                // console.log(orderDetails);
                orderDetail.push(orderDetails);

                console.log(orderDetail);
            }

            order.addValue(oID[1], currDate[1], selectCusOp.val(), orderDetail);
            orders.push(order);

        }else {
            alert("Insufficient payment amount")
        }
    }else {
        alert("Please add ur payment")
    }
    console.log(orders);

})
