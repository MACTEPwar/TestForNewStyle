let domen = "https://localhost:44334/";

$(document).ready(function () {
    $(".navbar-nav li.nav-item a").each(function () {
        console.log($(this).text());
        if ($(this).text() === "Товары") {
            $(this).parent().addClass('active');
        }
    });
    // Клик "добавить"
    $(".btnProductCreate").click(function () {
        var rowTemplate = `
        <tr>
            <td style="display:none" class="product_id"></td>
            <td>
                <div class="view-row">
                    <div class="product_title"></div>
                </div>
                <div class="update-row">
                    <input type="text" class="btn-block form-control inputUpdateTitleProduct" autocomplete="off">
                </div>
            </td>
            <td class="text-center">
                <div class="view-row">
                    <a class="btn btn-warning btnProductUpdate">Изменить</a>
                    <a class="btn btn-danger btnProductDelete">Удалить</a>
                </div>
                <div class="update-row" style="display:none">
                    <a class="btn btn-success btnProductSave">Сохранить</a>
                    <a class="btn btn-danger btnProductCancel">Отмена</a>
                </div>
            </td>
        </tr>
        `;
        let data = JSON.stringify({ Title: $("#inputProductTitle").val() });
        $.ajax({
            type: "POST",
            url: domen + "Product/Create",
            data: data,
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            processData: false,
            success: function (res) {
                var $row = $(rowTemplate);
                $row.find(".product_id").text(res.id);
                $row.find(".product_title").text(res.title);
                $("#productTbody").append($row);
            }
        });
    });
    // Клик "удалить"
    $("#productTbody").on('click', ".btnProductDelete", function () {
        let row = $(this).parent().parent().parent();
        let id = row.find(".product_id").text();
        $.ajax({
            url: domen + "product/delete/" + id,
            type: "delete",
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: () => {
                row.remove();
            }
        });
    });
    // Клик "изменить"
    $("#productTbody").on('click', ".btnProductUpdate", function () {
        alert(123);
        let row = $(this).parent().parent().parent();
        row.find(".view-row").css("display", "none");
        row.find(".update-row").css("display", "block");
    });
    // Клик "очистить"
    $("#productTbody").on('click', ".btnProductClear", function () {
        $("#inputProductTitle").val("");
    });
    // Клик "отмена"
    $("#productTbody").on('click', ".btnProductCancel", function () {
        let row = $(this).parent().parent().parent();
        cancelUpdating(row);
    });
    // Клик "сохранить"
    $("#productTbody").on('click', ".btnProductSave", function () {
        
        let row = $(this).parent().parent().parent();
        let id = row.find(".product_id").text();
        let inp = row.find(".inputUpdateTitleProduct");
        let data = JSON.stringify({ Title:inp.val() });
        $.ajax({
            type: "PUT",
            url: domen + "Product/Update/" + id,
            data: data,
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            processData: false,
            success: function (res) {
                row.find(".inputUpdateTitleProduct").parent().parent().find(".view-row div").text(res.title);
                cancelUpdating(row);               
            }
        });
    });
});

// Отменяет редактирование
function cancelUpdating(row) {
    row.find(".view-row").css("display", "block");
    row.find(".update-row").css("display", "none");
}