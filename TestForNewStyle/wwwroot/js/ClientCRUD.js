let domen = "https://localhost:44334/";

$(document).ready(function () {
    $(".navbar-nav li.nav-item a").each(function () {
        if ($(this).text() === "Клиенты") {
            $(this).parent().addClass('active');
        }
    });
    // Клик "добавить"
    $(".btnClientCreate").click(function () {
        var rowTemplate = `
        <tr>
            <td style="display:none" class="client_id"></td>
            <td>
                <div class="view-row">
                    <div class="client_name"></div>
                </div>
                <div class="update-row">
                    <input type="text" class="btn-block form-control inputUpdateNameClient" autocomplete="off">
                </div>
            </td>
            <td class="text-center">
                <div class="view-row">
                    <a class="btn btn-warning btnClientUpdate">Изменить</a>
                    <a class="btn btn-danger btnClientDelete">Удалить</a>
                </div>
                <div class="update-row" style="display:none">
                    <a class="btn btn-success btnClientSave">Сохранить</a>
                    <a class="btn btn-danger btnClientCancel">Отмена</a>
                </div>
            </td>
        </tr>
        `;
        let data = JSON.stringify({ Name: $("#inputClientName").val() });
        $.ajax({
            type: "POST",
            url: domen + "Client/Create",
            data: data,
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            processData: false,
            success: function (res) {
                console.log(res);
                var $row = $(rowTemplate);
                $row.find(".client_id").text(res.id);
                $row.find(".client_name").text(res.name);
                $("#clientTbody").append($row);
            },
            error: () => console.log("error")
        });
    });
    // Клик "удалить"
    $("#clientTbody").on('click', ".btnClientDelete", function () {
        let row = $(this).parent().parent().parent();
        let id = row.find(".client_id").text();
        $.ajax({
            url: domen + "client/delete/" + id,
            type: "delete",
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: () => {
                row.remove();
            }
        });
    });
    // Клик "изменить"
    $("#clientTbody").on('click', ".btnClientUpdate", function () {
        let row = $(this).parent().parent().parent();
        row.find(".view-row").css("display", "none");
        row.find(".update-row").css("display", "block");
    });
    // Клик "очистить"
    $("#clientTbody").on('click', ".btnClientClear", function () {
        $("#inputClientName").val("");
    });
    // Клик "отмена"
    $("#clientTbody").on('click', ".btnClientCancel", function () {
        let row = $(this).parent().parent().parent();
        cancelUpdating(row);
    });
    // Клик "сохранить"
    $("#clientTbody").on('click', ".btnClientSave", function () {

        let row = $(this).parent().parent().parent();
        let id = row.find(".client_id").text();
        let inp = row.find(".inputUpdateNameClient");
        let data = JSON.stringify({ Name: inp.val() });
        $.ajax({
            type: "PUT",
            url: domen + "Client/Update/" + id,
            data: data,
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            processData: false,
            success: function (res) {
                row.find(".inputUpdateNameClient").parent().parent().find(".view-row div").text(res.name);
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