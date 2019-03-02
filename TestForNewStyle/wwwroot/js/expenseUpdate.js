let domen = "https://localhost:44334/";

// Общая сумма
let sum;
$(document).ready(function () {
    $("#selected_client option").each(function () {
        if (expenses.client.id == $(this).val()) {
            $("#selected_client").val(expenses.client.id);
        }
    });
    expenses.contents.forEach(function (el, ind) {
        addContent($("#tableExpenses"), el, ind);
    });

    // Клик по кнопке "очистить"
    $("#btnClearEditCol").click(function () {
        $(this).parent().parent().find("input").each(function () {
            $(this).val("");
        });
    });
    // Клик по кнопке "провести"
    $("#btnExpenseHold").click(function () {
        requestToExpense(getDateNow(), expenses.expenseCreated, $("#selected_client").val(), sum, 1, Date(), expenses.contents);
    });
    // Клик по кнопке "отложить"
    $("#btnExpenseDelayed").click(function () {
        requestToExpense(getDateNow(), expenses.expenseCreated, $("#selected_client").val(), sum, 0, null, expenses.contents);
    });
    // Клик по кнопке "отменить"
    $("#btnExpenseCanseled").click(function () {
        requestToExpense(getDateNow(), expenses.expenseCreated, $("#selected_client").val(), sum, 2, null, expenses.contents);
    });
    // Клик на добавить содержимое расхода
    $("#btnAddingExpenseToTable").click(function () {
        let num = 0;
        sum = 0;
        if (isNaN(+$(this).parent().parent().find("#inputExpensePrice").val()) || isNaN(+$(this).parent().parent().find("#inputExpenseCount").val()) || $(this).parent().parent().find("#inputExpenseCode").val() === "" || $(this).parent().parent().find("#inputExpensePrice").val() == "" || $(this).parent().parent().find("#inputExpenseCount").val() == "") {
            alert("Количество и цена должны быть числами, поле \"код\" не должно быть пустым. Пожалуйста повторите оппытку");
            return;
        }
        expenses.contents.push({
            code: $(this).parent().parent().find("#inputExpenseCode").val(),
            product: { id: $(this).parent().parent().find("#selected_product").val(), title: $(this).parent().parent().find("#selected_product option")[$(this).parent().parent().find("#selected_product")[0].selectedIndex].innerHTML },
            count: $(this).parent().parent().find("#inputExpenseCount").val(),
            price: $(this).parent().parent().find("#inputExpensePrice").val(),
            sum: $(this).parent().parent().find("#inputExpenseCount").val() * $(this).parent().parent().find("#inputExpensePrice").val()
        });
        let index = expenses.contents.length - 1;
        let currentExpense = expenses.contents[index];
        $("#tableExpenses").append("<div class='row my-2'><div class='col idExpense'>" + index + "</div><div class='col' name='code'><div class='row view-row'>" + currentExpense.code + "</div><div class='row update-row'><input type='text' class='form-control'/></div></div><div class='col' name='selectedProduct'><div class='row view-row'>" + currentExpense.product.title + "</div><div class='row update-row'><select class='form-control' id='selectUpdateProduct'></select></div></div><div class='col' name='count'><div class='row view-row'>" + currentExpense.count + "</div><div class='row update-row'><input type='text' class='form-control' /></div></div><div class='col' name='price'><div class='row view-row'>" + currentExpense.price + "</div><div class='row update-row'><input type='text' class='form-control'/></div></div><div class='col' name='sum'><div class='row view-row'>" + currentExpense.sum + "</div></div><div class='col text-center'><div class='row view-row'><button class='btnUpdatingExpenseInTable btn btn-block btn-outline-warning' onclick='ViewToEdit($(this));'>Изменить</button></div><div class='row update-row'><button class='btn btn-block btn-outline-warning btnSaveUpdatingExpenseInTable' onclick='SaveUpdatingData($(this));'>Сохранить</button></div></div><div class='col text-center'><div class='row view-row'><button class='btn btn-block btn-outline-danger' onclick='DeleteUdpatingData($(this));'>Удалить</button></div><div class='row update-row'><button class='btn btn-block btn-outline-danger' id='btnCancelUpdatingExpenseInTable'>Отменить</button></div></div></div>");
        let selects = $(".col[name='selectedProduct'] select");

        selects.each(function () {
            let select = $(this);
            if (select.find("option").length === 0)
                products.forEach(function (el) {
                    select.append("<option value=" + el.id + ">" + el.title + "</option>");
                });
        });

        expenses.contents.forEach(function (el) {
            sum += el.sum;
        });
        $("#amountExpense").text(sum.toString());
    });

    $(".test").click(function () {
        console.log(expenses.contents);
    });
});

// Вставляем данные
function addContent(table, currentExpense, ind) {
    table.append("<div class='row my-2'><div class='col idExpense'>" + ind + "</div><div class='col' name='code'><div class='row view-row'>" + currentExpense.code + "</div><div class='row update-row'><input type='text' class='form-control'/></div></div><div class='col' name='selectedProduct'><div class='row view-row'>" + currentExpense.product.title + "</div><div class='row update-row'><select class='form-control' id='selectUpdateProduct'></select></div></div><div class='col' name='count'><div class='row view-row'>" + currentExpense.count + "</div><div class='row update-row'><input type='text' class='form-control' /></div></div><div class='col' name='price'><div class='row view-row'>" + currentExpense.price + "</div><div class='row update-row'><input type='text' class='form-control'/></div></div><div class='col' name='sum'><div class='row view-row'>" + currentExpense.sum + "</div></div><div class='col text-center'><div class='row view-row'><button class='btnUpdatingExpenseInTable btn btn-block btn-outline-warning' onclick='ViewToEdit($(this));'>Изменить</button></div><div class='row update-row'><button class='btn btn-block btn-outline-warning btnSaveUpdatingExpenseInTable' onclick='SaveUpdatingData($(this));'>Сохранить</button></div></div><div class='col text-center'><div class='row view-row'><button class='btn btn-block btn-outline-danger' onclick='DeleteUdpatingData($(this));'>Удалить</button></div><div class='row update-row'><button class='btn btn-block btn-outline-danger' id='btnCancelUpdatingExpenseInTable'>Отменить</button></div></div></div>");

    let selects = $(".col[name='selectedProduct'] select");

    selects.each(function () {
        let select = $(this);
        if (select.find("option").length === 0)
            products.forEach(function (el) {
                select.append("<option value=" + el.id + ">" + el.title + "</option>");
            });
    });
}

//Удаляем выбранное содержание
function DeleteUdpatingData(el) {
    // Вся выбранная строка
    let row = el.parent().parent().parent();
    expenses.contents[row.find(".idExpense").text()].deleted = true;
    row.css("background-color", "#ff000017");
    sum = 0;
    expenses.contents.forEach(function (el) {
        sum += el.sum;
    });
    $("#amountExpense").text(sum.toString());
}

// Клик по кнопке "сохранить"
function SaveUpdatingData(el) {
    // Вся выбранная строка
    let row = el.parent().parent().parent();

    if (isNaN(+row.find(".col[name='count'] input").val()) || isNaN(+row.find(".col[name='price'] input").val()) || row.find(".col[name='code'] input").val() === "" || row.find(".col[name='count'] input").val() == "" || row.find(".col[name='price'] input").val() == "") {
        alert("Количество и цена должны быть числами, поле \"код\" не должно быть пустым. Пожалуйста повторите оппытку");
        return;
    }

    let content = expenses.contents[row.find(".idExpense").text()] = {
        id: expenses.contents[row.find(".idExpense").text()].id,
        code: row.find(".col[name='code'] input").val(),
        expenseId: expenses.contents[row.find(".idExpense").text()].expenseId,
        product: {
            Id: row.find(".col[name='selectedProduct'] select").val(), Title: row.find(".col[name='selectedProduct'] select option")[row.find(".col[name='selectedProduct'] select")[0].selectedIndex].innerHTML
        },
        productId: expenses.contents[row.find(".idExpense").text()].productId,
        count: row.find(".col[name='count'] input").val(),
        price: row.find(".col[name='price'] input").val(),
        sum: row.find(".col[name='count'] input").val() * row.find(".col[name='price'] input").val()
    };

    row.find(".col[name='code'] .view-row").text(content.code).end().find(".col[name='selectedProduct'] .view-row").text(content.product.Title).end().find(".col[name='count'] .view-row").text(content.count).end().find(".col[name='price'] .view-row").text(content.price).end().find(".col[name='sum'] .view-row").text(content.sum);

    row.find(".update-row").each(function () {
        $(this).css("display", "none");
    }).end().find(".view-row").each(function () {
        $(this).css("display", "block");
    });
    sum = 0;
    expenses.contents.forEach(function (el) {
        sum += el.sum;
    });
    $("#amountExpense").text(sum.toString());
}

// Клик по кнопке "изменить"
function ViewToEdit(el, obj) {
    let row = el.parent().parent().parent();
    row.find(".update-row").each(function () {
        $(this).css("display", "block");
    }).end().find(".view-row").each(function () {
        $(this).css("display", "none");
    });
    let editElement = expenses.contents[el.parent().parent().parent().find(".idExpense").text()];
    let iter = 0;
    row.find(".update-row").each(function () {
        let input = $(this).find("input");
        if (input.length > 0) {
            switch (iter) {
                case 0: {
                    input.val(editElement.code);
                    break;
                }
                case 1: {
                    input.val(editElement.count);
                    break;
                }
                case 2: {
                    input.val(editElement.price);
                    break;
                }
            }
            iter++;
        }
    });
    row.find(".update-row select option").each(function () {
        if ($(this).val() === editElement.product.Id)
            row.find(".update-row select")[0].selectedIndex = $(this).index();
    });
}

/// Обновляем в БД расход и его содержимое
function requestToExpense(date, dateCreate, clientId, sum, status, dateSpeading, mass) {
    let data = JSON.stringify({ Date: date, ClientId: clientId, Sum: sum, ExpenseCreated: dateCreate, ExpenseStatus: status, TimeSpeadingExpense: dateSpeading });
    $.ajax({
        type: "PUT",
        crossDomain: true,
        url: domen + "Data/Expense/Update/" + expenses.id,
        contentType: "application/json; charset=utf-8",
        data: data,
        processData: false,
        success: function (res) {
            // Обновляем ячейки
            mass.forEach(function (content) {
                if (content.deleted === undefined) {
                    if (content.id !== undefined) {
                        let data2 = JSON.stringify(content);
                        $.ajax({
                            type: "PUT",
                            crossDomain: true,
                            url: domen + "Data/Content/Update/" + content.id,
                            contentType: "application/json; charset=utf-8",
                            data: data2,
                            processData: false,
                            success: function (res) {
                                location.href = domen + "Data";
                            },
                            error: () => console.log("error")
                        });
                    }
                    else {
                        content.productId = parseInt(content.product.id);
                        content.expenseId = parseInt($(".var[name='id']").text());
                        let data2 = JSON.stringify(content);
                        $.ajax({
                            type: "POST",
                            crossDomain: true,
                            url: domen + "Data/Content/Create",
                            contentType: "application/json; charset=utf-8",
                            data: data2,
                            processData: false,
                            success: function (res) {
                                location.href = domen + "Data";
                            },
                            Error: function () {
                            }
                        });
                    }
                }
                else if (content.deleted) {
                    if (content.id !== undefined) {
                        $.ajax({
                            type: "DELETE",
                            crossDomain: true,
                            url: domen + "Data/Content/Delete/" + content.id,
                            contentType: "application/json; charset=utf-8",
                            processData: false,
                            success: function (res) {
                                location.href = domen + "Data";
                            },
                            error: () => console.log("error")
                        });
                    }
                }
            });
        },
        Error: function () {
        }
    });
}

function getDateNow() {
    var now = new Date();
    var dd = now.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = now.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var hh = now.getHours();
    if (hh < 10) hh = '0' + hh;

    var m = now.getMinutes();
    if (m < 10) m = '0' + m;

    var ss = now.getSeconds();
    if (ss < 10) ss = '0' + ss;

    return now.getFullYear() + "-" + mm + "-" + dd + " " + hh + ":" + m + ":" + ss;
}