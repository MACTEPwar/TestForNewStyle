let domen = "https://localhost:44334/";

$(document).ready(function () {
    $(".navbar-nav li.nav-item a").each(function () {
        if ($(this).text() === "Расходы") {
            $(this).parent().addClass('active');
        }
    });
    $(".expenseViewRow").each(function () {
        if ($(this).find(".var[name='ExpenseStatus']").text() !== "HOLD") {
            $(this).find(".buttonForEdit").removeClass("d-none");
        }
    });
    $(".btnUpdateExpense").click(function () {
        let element = $(this).parent().parent().parent().parent();
        location.href = domen + "/Data/Update/" + element.find("[name='id']").text();
    });
    $(".btnDeleteExpense").click(function () {
        let row = $(this).parent().parent().parent().parent().parent();
        $.ajax({
            type: "DELETE",
            crossDomain: true,
            url: domen + "Data/Expense/Delete/" + $(this).parent().parent().parent().parent().find("[name='id']").text(),
            contentType: "application/json; charset=utf-8",
            processData: false,
            success: function (res) {
               row.remove();
            }
        });
    });
});