
let domen = "https://localhost:44334/";

let ExpenseContents = [];
jQuery(document).ready(function () {
    $(".navbar-nav li.nav-item a").each(function () {
        console.log($(this).text());
        if ($(this).text() === "Создать расход") {
            $(this).parent().addClass('active');
        }
    });
    let products = [];
    jQuery("#selected_product option").each(function () {
        products.push({ Title: $(this).text(), Id: $(this).val() });
    });    
    let sum = 0;
    let CreatedDate = getDateNow();
    // Клик на добавить содержимое расхода
    jQuery("#btnAddingExpenseToTable").click(function () {
        let num = 0;
        sum = 0;
        ExpenseContents.push({
            code: $(this).parent().parent().find("#inputExpenseCode").val(),
            product: { Id: $(this).parent().parent().find("#selected_product").val(), Title: $(this).parent().parent().find("#selected_product option")[$(this).parent().parent().find("#selected_product")[0].selectedIndex].innerHTML },
            count: $(this).parent().parent().find("#inputExpenseCount").val(),
            price: $(this).parent().parent().find("#inputExpensePrice").val(),
            sum: $(this).parent().parent().find("#inputExpenseCount").val() * $(this).parent().parent().find("#inputExpensePrice").val()
        });
        if (isNaN(+$(this).parent().parent().find("#inputExpensePrice").val()) || isNaN(+$(this).parent().parent().find("#inputExpenseCount").val()) || $(this).parent().parent().find("#inputExpenseCode").val() === "" || $(this).parent().parent().find("#inputExpensePrice").val() == "" || $(this).parent().parent().find("#inputExpenseCount").val() == "") {
            alert("Количество и цена должны быть числами, поле \"код\" не должно быть пустым. Пожалуйста повторите оппытку");
            return;
        }
        let index = ExpenseContents.length - 1;
        let currentExpense = ExpenseContents[index];
        jQuery("#tableExpenses").append("<div class='row my-2'><div class='col idExpense'>" + index + "</div><div class='col' name='code'><div class='row view-row'>" + currentExpense.code + "</div><div class='row update-row'><input type='text' class='form-control'/></div></div><div class='col' name='selectedProduct'><div class='row view-row'>" + currentExpense.product.Title + "</div><div class='row update-row'><select class='form-control' id='selectUpdateProduct'></select></div></div><div class='col' name='count'><div class='row view-row'>" + currentExpense.count + "</div><div class='row update-row'><input type='text' class='form-control' /></div></div><div class='col' name='price'><div class='row view-row'>" + currentExpense.price + "</div><div class='row update-row'><input type='text' class='form-control'/></div></div><div class='col' name='sum'><div class='row view-row'>" + currentExpense.sum + "</div></div><div class='col text-center'><div class='row view-row'><button class='btnUpdatingExpenseInTable btn btn-block btn-outline-warning' onclick='ViewToEdit($(this));'>Изменить</button></div><div class='row update-row'><button class='btn btn-block btn-outline-warning btnSaveUpdatingExpenseInTable' onclick='SaveUpdatingData($(this));'>Сохранить</button></div></div><div class='col text-center'><div class='row view-row'><button class='btn btn-block btn-outline-danger' onclick='DeleteUdpatingData($(this));'>Удалить</button></div><div class='row update-row'><button class='btn btn-block btn-outline-danger' id='btnCancelUpdatingExpenseInTable'>Отменить</button></div></div></div>");
        let selects = jQuery(".col[name='selectedProduct'] select");
        
        selects.each(function () {
            let select = $(this);
            if (select.find("option").length === 0)
                products.forEach(function (el) {
                     select.append("<option value=" + el.Id + ">" + el.Title + "</option>");
                });
        });
        
        ExpenseContents.forEach(function (el) {
            sum += el.sum;
        });
        jQuery("#amountExpense").text(sum.toString());
    });
    // Клик по кнопке "провести"
    jQuery("#btnExpenseHold").click(function () {
        requestToExpense(getDateNow(), CreatedDate, jQuery("#selected_client").val(), sum, 1, getDateNow(), ExpenseContents);
    });
    // Клик по кнопке "отложить"
    jQuery("#btnExpenseDelayed").click(function () {
        requestToExpense(getDateNow(), CreatedDate, jQuery("#selected_client").val(), sum, 0, null, ExpenseContents);
    });
    // Клик по кнопке "отменить"
    jQuery("#btnExpenseCanseled").click(function () {
        requestToExpense(getDateNow(), CreatedDate, jQuery("#selected_client").val(), sum, 2, null, ExpenseContents);
    });
    // Клик по кнопке "очистить"
    jQuery("#btnClearEditCol").click(function () {
        $(this).parent().parent().find("input").each(function () {
           $(this).val("");
        });
    });
});

//Удаляем выбранное содержание
function DeleteUdpatingData(el) {
    // Вся выбранная строка
    let row = el.parent().parent().parent();
    ExpenseContents.splice(row.find(".idExpense").text(), 1);
    row.remove();
    sum = 0;
    ExpenseContents.forEach(function (el) {
        sum += el.sum;
    });
    jQuery("#amountExpense").text(sum.toString());
}

// Клик по кнопке "сохранить"
function SaveUpdatingData(el) {
    // Вся выбранная строка
    let row = el.parent().parent().parent();

    let content = {
        code: row.find(".col[name='code'] input").val(),
        product: {
            Id: row.find(".col[name='selectedProduct'] select").val(), Title: row.find(".col[name='selectedProduct'] select option")[row.find(".col[name='selectedProduct'] select")[0].selectedIndex].innerHTML
        },
        count: row.find(".col[name='count'] input").val(),
        price: row.find(".col[name='price'] input").val(),
        sum: row.find(".col[name='count'] input").val() * row.find(".col[name='price'] input").val()
    };

    if (isNaN(+content.price) || isNaN(+content.count) || content.code === "" || content.count == "" || content.price == "") {
        alert("Количество и цена должны быть числами, поле \"код\" не должно быть пустым. Пожалуйста повторите оппытку");
        return;
    }

    ExpenseContents[row.find(".idExpense").text()] = {
        code: content.code,
        product: {
            Id: content.product.Id, Title: content.product.Title
        },
        count: content.count,
        price: content.price,
        sum: content.sum
    };

    row.find(".col[name='code'] .view-row").text(content.code).end().find(".col[name='selectedProduct'] .view-row").text(content.product.Title).end().find(".col[name='count'] .view-row").text(content.count).end().find(".col[name='price'] .view-row").text(content.price).end().find(".col[name='sum'] .view-row").text(content.sum);

    el.parent().parent().parent().find(".update-row").each(function () {
        $(this).css("display", "none");
    }).end().find(".view-row").each(function () {
        $(this).css("display", "block");
    });
    sum = 0;
    ExpenseContents.forEach(function (el) {
        sum += el.sum;
    });
    jQuery("#amountExpense").text(sum.toString());
}

// Клик по кнопке "изменить"
function ViewToEdit(el, obj) {
    el.parent().parent().parent().find(".update-row").each(function () {
        $(this).css("display", "block");
    }).end().find(".view-row").each(function () {
        $(this).css("display", "none");
    });
    let editElement = ExpenseContents[el.parent().parent().parent().find(".idExpense").text()];
    let iter = 0;
    el.parent().parent().parent().find(".update-row").each(function () {
        let input = $(this).find("input");
        if (input.length > 0)
        {
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
    el.parent().parent().parent().find(".update-row select option").each(function () {
        if ($(this).val() === editElement.product.Id)
            el.parent().parent().parent().find(".update-row select")[0].selectedIndex = $(this).index();
    });
}

/// Вносим в БД расход и его содержимое
function requestToExpense(date, dateCreate, clientId, sum, status, dateSpeading,mass) {
    let data = JSON.stringify({ Date: date, ClientId: clientId, Sum: sum, ExpenseCreated: dateCreate, ExpenseStatus: status, TimeSpeadingExpense: dateSpeading });
    jQuery.ajax({
        type: "POST",
        crossDomain: true,
        url: domen + "Data/Expense/Create",
        contentType: "application/json; charset=utf-8",
        data: data,
        processData: false,
        success: function (res) {
            let contents = [];

            mass.forEach(function (el) {
                contents.push({ Code: el.code, ProductId: el.product.Id, Count: el.count, Price: el.price, Sum: el.sum, ExpenseId: res });
            });

            let data2 = JSON.stringify({ contents });
            jQuery.ajax({
                type: "POST",
                crossDomain: true,
                url: domen + "Data/Contents/Create",
                contentType: "application/json; charset=utf-8",
                data: data2,
                processData: false,
                success: function (res) {
                    location.href = domen + "Data";
                },
                error: () => console.log("error")
            });
        },
        error: () => console.log("error")
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